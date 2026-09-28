import { gerarUsuario } from '../../../support/factories/usuario.factory'

describe('API - Usuários', () => {
  let mensagens

  before(() => {
    cy.fixture('mensagens').then((dados) => {
      mensagens = dados
    })
  })

  context('Dado um usuário com dados válidos', () => {
    const usuario = gerarUsuario()
    let usuarioId

    after(() => {
      if (usuarioId) cy.apiExcluirUsuario(usuarioId)
    })

    it('deve cadastrar o usuário e permitir consultá-lo pelo id', () => {
      cy.apiCadastrarUsuario(usuario).then((resposta) => {
        expect(resposta.status).to.eq(201)
        expect(resposta.body.message).to.eq(mensagens.cadastroSucesso)
        expect(resposta.body._id).to.be.a('string').and.not.be.empty

        usuarioId = resposta.body._id

        cy.apiBuscarUsuario(usuarioId).then(({ status, body }) => {
          expect(status).to.eq(200)
          expect(body).to.deep.equal({ ...usuario, _id: usuarioId })
        })
      })
    })
  })

  context('Dado um e-mail já cadastrado', () => {
    const usuario = gerarUsuario()

    beforeEach(() => {
      cy.criarUsuario(usuario).as('usuarioExistente')
    })

    afterEach(() => {
      cy.get('@usuarioExistente').then(({ _id }) => cy.apiExcluirUsuario(_id))
    })

    it('não deve permitir cadastrar outro usuário com o mesmo e-mail', () => {
      const usuarioDuplicado = gerarUsuario({ email: usuario.email })

      cy.apiCadastrarUsuario(usuarioDuplicado, { failOnStatusCode: false }).then(({ status, body }) => {
        expect(status).to.eq(400)
        expect(body).to.deep.equal({ message: mensagens.emailEmUso })
      })
    })
  })
})
