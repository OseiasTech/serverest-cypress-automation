import { gerarUsuario } from '../../../support/factories/usuario.factory'

describe('API - Login', () => {
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

  it('deve autenticar com credenciais válidas e retornar um token Bearer', () => {
    cy.apiLogin(usuario).then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.message).to.eq(mensagens.loginSucesso)
      expect(body.authorization).to.match(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
    })
  })

  it('deve recusar a autenticação com senha incorreta', () => {
    cy.apiLogin({ email: usuario.email, password: 'senha-incorreta' }, { failOnStatusCode: false }).then(
      ({ status, body }) => {
        expect(status).to.eq(401)
        expect(body).to.deep.equal({ message: mensagens.loginInvalido })
        expect(body).to.not.have.property('authorization')
      },
    )
  })
})
