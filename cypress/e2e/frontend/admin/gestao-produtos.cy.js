import adminCadastroProdutoPage from '../../../support/pages/admin/cadastro-produto.page'
import adminListaProdutosPage from '../../../support/pages/admin/lista-produtos.page'
import { gerarAdministrador } from '../../../support/factories/usuario.factory'
import { gerarProduto } from '../../../support/factories/produto.factory'

describe('Frontend - Gestão de produtos (administrador)', () => {
  const administrador = gerarAdministrador()
  const produtosCriados = []
  let token

  before(() => {
    cy.criarUsuario(administrador).then(({ _id }) => {
      administrador._id = _id
    })
    cy.obterToken(administrador).then((tokenAdmin) => {
      token = tokenAdmin
    })
  })

  after(() => {
    // failOnStatusCode: false porque o cenário de exclusão já remove o próprio produto
    produtosCriados.forEach((id) => cy.apiExcluirProduto(id, token, { failOnStatusCode: false }))
    cy.apiExcluirUsuario(administrador._id)
  })

  beforeEach(() => {
    cy.loginUi(administrador)
  })

  it('deve cadastrar um produto e exibi-lo na listagem', () => {
    const produto = gerarProduto()
    cy.intercept('POST', '**/produtos').as('cadastrarProduto')

    adminCadastroProdutoPage.visitar().cadastrar(produto)

    cy.wait('@cadastrarProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(201)
      produtosCriados.push(response.body._id)
    })
    cy.location('pathname').should('eq', '/admin/listarprodutos')
    adminListaProdutosPage.elementos.titulo().should('have.text', 'Lista dos Produtos')
    adminListaProdutosPage.elementos
      .linhaProduto(produto.nome)
      .should('be.visible')
      .and('contain.text', produto.preco)
      .and('contain.text', produto.descricao)
      .and('contain.text', produto.quantidade)
  })

  it('deve excluir um produto pela listagem', () => {
    const produto = gerarProduto()
    cy.apiCadastrarProduto(produto, token)
      .its('body._id')
      .then((id) => {
        produtosCriados.push(id)
      })
      .as('produtoId')
    cy.intercept('DELETE', '**/produtos/*').as('excluirProduto')

    adminListaProdutosPage.visitar().excluirProduto(produto.nome)

    cy.wait('@excluirProduto').its('response.statusCode').should('eq', 200)
    adminListaProdutosPage.elementos.titulo().should('be.visible')
    cy.contains('table tbody tr', produto.nome).should('not.exist')
    cy.get('@produtoId').then((id) => {
      cy.apiBuscarProduto(id, { failOnStatusCode: false }).its('status').should('eq', 400)
    })
  })
})
