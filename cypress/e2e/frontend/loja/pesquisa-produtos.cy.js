import homePage from '../../../support/pages/home.page'
import { gerarUsuario } from '../../../support/factories/usuario.factory'

describe('Frontend - Pesquisa de produtos', () => {
  const cliente = gerarUsuario()

  before(() => {
    cy.criarUsuario(cliente).then(({ _id }) => {
      cliente._id = _id
    })
  })

  after(() => {
    cy.apiExcluirUsuario(cliente._id)
  })

  beforeEach(() => {
    cy.loginUi(cliente)
    homePage.visitar()
  })

  it('deve informar quando nenhum produto corresponde à pesquisa', () => {
    homePage.pesquisarProduto(`produto-inexistente-${Date.now()}`)

    homePage.elementos.mensagemSemResultado().should('be.visible')
    homePage.elementos.cardsProduto().should('not.exist')
  })
})
