import { gerarAdministrador, gerarUsuario } from '../../../support/factories/usuario.factory'
import { gerarProduto } from '../../../support/factories/produto.factory'

describe('API - Produtos', () => {
  const administrador = gerarAdministrador()
  const usuarioComum = gerarUsuario()
  const produtosCriados = []
  let mensagens
  let tokenAdmin
  let tokenUsuarioComum

  before(() => {
    cy.fixture('mensagens').then((dados) => {
      mensagens = dados
    })

    cy.criarUsuario(administrador).then(({ _id }) => {
      administrador._id = _id
    })
    cy.obterToken(administrador).then((token) => {
      tokenAdmin = token
    })

    cy.criarUsuario(usuarioComum).then(({ _id }) => {
      usuarioComum._id = _id
    })
    cy.obterToken(usuarioComum).then((token) => {
      tokenUsuarioComum = token
    })
  })

  after(() => {
    produtosCriados.forEach((id) => cy.apiExcluirProduto(id, tokenAdmin))
    cy.apiExcluirUsuario(administrador._id)
    cy.apiExcluirUsuario(usuarioComum._id)
  })

  it('deve permitir que um administrador cadastre um produto', () => {
    const produto = gerarProduto()

    cy.apiCadastrarProduto(produto, tokenAdmin).then(({ status, body }) => {
      expect(status).to.eq(201)
      expect(body.message).to.eq(mensagens.cadastroSucesso)
      expect(body._id).to.be.a('string').and.not.be.empty

      produtosCriados.push(body._id)

      cy.apiBuscarProduto(body._id).its('body').should('deep.equal', { ...produto, _id: body._id })
    })
  })

  it('não deve permitir cadastrar produto com nome já existente', () => {
    const produto = gerarProduto()

    cy.apiCadastrarProduto(produto, tokenAdmin).then(({ body }) => produtosCriados.push(body._id))

    cy.apiCadastrarProduto(produto, tokenAdmin, { failOnStatusCode: false }).then(({ status, body }) => {
      expect(status).to.eq(400)
      expect(body).to.deep.equal({ message: mensagens.produtoDuplicado })
    })
  })

  it('não deve permitir que um usuário não administrador cadastre produto', () => {
    cy.apiCadastrarProduto(gerarProduto(), tokenUsuarioComum, { failOnStatusCode: false }).then(
      ({ status, body }) => {
        expect(status).to.eq(403)
        expect(body).to.deep.equal({ message: mensagens.rotaAdmin })
      },
    )
  })
})
