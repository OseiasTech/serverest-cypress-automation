import cadastroUsuarioPage from '../../../support/pages/cadastro-usuario.page'
import homePage from '../../../support/pages/home.page'
import { gerarUsuario } from '../../../support/factories/usuario.factory'

describe('Frontend - Cadastro de usuário', () => {
  let mensagens
  let usuarioId

  before(() => {
    cy.fixture('mensagens').then((dados) => {
      mensagens = dados
    })
  })

  afterEach(() => {
    if (usuarioId) cy.apiExcluirUsuario(usuarioId)
    usuarioId = undefined
  })

  it('deve cadastrar um novo usuário e redirecioná-lo para a home logado', () => {
    const usuario = gerarUsuario()
    cy.intercept('POST', '**/usuarios').as('cadastrarUsuario')

    cadastroUsuarioPage.visitar().cadastrar(usuario)

    cy.wait('@cadastrarUsuario').then(({ response }) => {
      expect(response.statusCode).to.eq(201)
      usuarioId = response.body._id
    })
    cadastroUsuarioPage.elementos.alerta().should('contain.text', mensagens.cadastroSucesso)
    cy.location('pathname').should('eq', '/home')
    homePage.elementos.titulo().should('have.text', 'Serverest Store')
    homePage.elementos.botaoLogout().should('be.visible')
  })

  it('deve exibir erro ao tentar cadastrar um e-mail já utilizado', () => {
    const usuario = gerarUsuario()
    cy.criarUsuario(usuario).then(({ _id }) => {
      usuarioId = _id
    })

    cadastroUsuarioPage.visitar().cadastrar(gerarUsuario({ email: usuario.email }))

    cadastroUsuarioPage.elementos.alerta().should('be.visible').and('contain.text', mensagens.emailEmUso)
    cy.location('pathname').should('eq', '/cadastrarusuarios')
  })
})
