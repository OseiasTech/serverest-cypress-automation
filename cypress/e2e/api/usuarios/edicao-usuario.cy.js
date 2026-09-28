import { gerarUsuario } from '../../../support/factories/usuario.factory'

describe('API - Edição de usuário', () => {
  const usuario = gerarUsuario()
  let mensagens

  before(() => {
    cy.fixture('mensagens').then((dados) => {
      mensagens = dados
    })
    cy.criarUsuario(usuario).then(({ _id }) => {
      usuario._id = _id
    })
  })

  after(() => {
    cy.apiExcluirUsuario(usuario._id)
  })

  it('deve atualizar os dados de um usuário existente', () => {
    const dadosAtualizados = gerarUsuario({ email: usuario.email })

    cy.apiEditarUsuario(usuario._id, dadosAtualizados).then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body).to.deep.equal({ message: mensagens.alteracaoSucesso })
    })

    cy.apiBuscarUsuario(usuario._id)
      .its('body')
      .should('deep.equal', { ...dadosAtualizados, _id: usuario._id })
  })
})
