import homePage from '../../support/pages/home.page'
import listaComprasPage from '../../support/pages/lista-compras.page'
import { gerarAdministrador, gerarUsuario } from '../../support/factories/usuario.factory'
import { gerarProduto } from '../../support/factories/produto.factory'

describe('Frontend - Lista de compras', () => {
  const administrador = gerarAdministrador()
  const cliente = gerarUsuario()
  const produto = gerarProduto()
  let tokenAdmin

  before(() => {
    cy.criarUsuario(administrador).then(({ _id }) => {
      administrador._id = _id
    })
    cy.obterToken(administrador).then((token) => {
      tokenAdmin = token
      cy.apiCadastrarProduto(produto, token).then(({ body }) => {
        produto._id = body._id
      })
    })
    cy.criarUsuario(cliente).then(({ _id }) => {
      cliente._id = _id
    })
  })

  after(() => {
    cy.apiExcluirProduto(produto._id, tokenAdmin)
    cy.apiExcluirUsuario(administrador._id)
    cy.apiExcluirUsuario(cliente._id)
  })

  beforeEach(() => {
    cy.loginUi(cliente)
    homePage.visitar()
  })

  it('deve pesquisar um produto e adicioná-lo à lista de compras', () => {
    homePage.pesquisarProduto(produto.nome)
    homePage.elementos.cardProduto(produto.nome).should('be.visible')

    homePage.adicionarNaLista(produto.nome)

    cy.location('pathname').should('eq', '/minhaListaDeProdutos')
    listaComprasPage.elementos.titulo().should('have.text', 'Lista de Compras')
    listaComprasPage.elementos.produtos().should('have.length', 1).and('contain.text', produto.nome)
    listaComprasPage.elementos.quantidade().should('contain.text', '1')
  })

  it('deve esvaziar a lista de compras ao clicar em limpar lista', () => {
    homePage.pesquisarProduto(produto.nome)
    homePage.adicionarNaLista(produto.nome)

    listaComprasPage.elementos.botaoLimparLista().click()

    listaComprasPage.elementos.produtos().should('not.exist')
    listaComprasPage.elementos.mensagemListaVazia().should('be.visible')
  })
})
