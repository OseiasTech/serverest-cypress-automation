import loginPage from '../../../support/pages/login.page'
import homePage from '../../../support/pages/home.page'
import { gerarUsuario } from '../../../support/factories/usuario.factory'

describe('Frontend - Login', () => {
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

  beforeEach(() => {
    loginPage.visitar()
  })

  it('deve autenticar com credenciais válidas e exibir a home da loja', () => {
    loginPage.autenticar(usuario)

    cy.location('pathname').should('eq', '/home')
    homePage.elementos.titulo().should('have.text', 'Serverest Store')
    cy.window().its('localStorage').invoke('getItem', 'serverest/userToken').should('match', /^Bearer /)
  })

  it('deve exibir mensagem de erro ao autenticar com senha inválida', () => {
    loginPage.autenticar({ email: usuario.email, password: 'senha-incorreta' })

    loginPage.elementos.alerta().should('be.visible').and('contain.text', mensagens.loginInvalido)
    cy.location('pathname').should('eq', '/login')
    cy.window().its('localStorage').invoke('getItem', 'serverest/userToken').should('be.null')
  })

  it('deve encerrar a sessão ao clicar em logout', () => {
    loginPage.autenticar(usuario)
    homePage.elementos.botaoLogout().click()

    cy.location('pathname').should('eq', '/login')
    loginPage.elementos.botaoEntrar().should('be.visible')
  })
})
