import loginPage from '../pages/login.page'

/**
 * Realiza o login pela interface e mantém a sessão em cache (cy.session),
 * evitando repetir o fluxo de login a cada teste.
 */
Cypress.Commands.add('loginUi', (usuario) => {
  cy.session(
    ['loginUi', usuario.email],
    () => {
      loginPage.visitar().autenticar(usuario)
      cy.location('pathname').should('not.eq', '/login')
    },
    {
      validate: () => {
        cy.window().its('localStorage').invoke('getItem', 'serverest/userToken').should('match', /^Bearer /)
      },
    },
  )
})
