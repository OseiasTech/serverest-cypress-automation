import { gerarAdministrador } from '../../../support/factories/usuario.factory'
import { gerarProduto } from '../../../support/factories/produto.factory'

describe('API - Carrinhos', () => {
  const administrador = gerarAdministrador()
  const produto = gerarProduto({ quantidade: 10 })
  const quantidadeComprada = 3
  let mensagens
  let token

  before(() => {
    cy.fixture('mensagens').then((dados) => {
      mensagens = dados
    })
    cy.criarUsuario(administrador).then(({ _id }) => {
      administrador._id = _id
    })
    cy.obterToken(administrador).then((tokenAdmin) => {
      token = tokenAdmin
      cy.apiCadastrarProduto(produto, token).then(({ body }) => {
        produto._id = body._id
      })
    })
  })

  afterEach(() => {
    // Garante que nenhum carrinho fique aberto: a API impede excluir usuário/produto com carrinho
    cy.apiCancelarCompra(token)
  })

  after(() => {
    cy.apiExcluirProduto(produto._id, token)
    cy.apiExcluirUsuario(administrador._id)
  })

  it('deve cadastrar um carrinho, calcular os totais e reservar o estoque do produto', () => {
    cy.apiCadastrarCarrinho([{ idProduto: produto._id, quantidade: quantidadeComprada }], token).then(
      ({ status, body }) => {
        expect(status).to.eq(201)
        expect(body.message).to.eq(mensagens.cadastroSucesso)

        cy.apiBuscarCarrinho(body._id).its('body').should((carrinho) => {
          expect(carrinho.idUsuario).to.eq(administrador._id)
          expect(carrinho.quantidadeTotal).to.eq(quantidadeComprada)
          expect(carrinho.precoTotal).to.eq(produto.preco * quantidadeComprada)
          expect(carrinho.produtos).to.deep.equal([
            { idProduto: produto._id, quantidade: quantidadeComprada, precoUnitario: produto.preco },
          ])
        })
      },
    )

    cy.apiBuscarProduto(produto._id)
      .its('body.quantidade')
      .should('eq', produto.quantidade - quantidadeComprada)
  })

  it('deve devolver o estoque ao cancelar a compra', () => {
    cy.apiCadastrarCarrinho([{ idProduto: produto._id, quantidade: quantidadeComprada }], token)

    cy.apiCancelarCompra(token).then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body).to.deep.equal({ message: mensagens.compraCancelada })
    })

    cy.apiBuscarProduto(produto._id).its('body.quantidade').should('eq', produto.quantidade)
  })
})
