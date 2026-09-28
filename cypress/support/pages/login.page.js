class LoginPage {
  elementos = {
    email: () => cy.get('[data-testid="email"]'),
    senha: () => cy.get('[data-testid="senha"]'),
    botaoEntrar: () => cy.get('[data-testid="entrar"]'),
    alerta: () => cy.get('.alert'),
  }

  visitar() {
    cy.visit('/login')
    return this
  }

  autenticar({ email, password }) {
    this.elementos.email().type(email)
    this.elementos.senha().type(password, { log: false })
    this.elementos.botaoEntrar().click()
    return this
  }
}

export default new LoginPage()
