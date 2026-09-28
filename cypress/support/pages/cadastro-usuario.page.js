class CadastroUsuarioPage {
  elementos = {
    nome: () => cy.get('[data-testid="nome"]'),
    email: () => cy.get('[data-testid="email"]'),
    senha: () => cy.get('[data-testid="password"]'),
    administrador: () => cy.get('[data-testid="checkbox"]'),
    botaoCadastrar: () => cy.get('[data-testid="cadastrar"]'),
    alerta: () => cy.get('.alert'),
  }

  visitar() {
    cy.visit('/cadastrarusuarios')
    return this
  }

  cadastrar({ nome, email, password, administrador }) {
    this.elementos.nome().type(nome)
    this.elementos.email().type(email)
    this.elementos.senha().type(password, { log: false })
    if (administrador === 'true') this.elementos.administrador().check()
    this.elementos.botaoCadastrar().click()
    return this
  }
}

export default new CadastroUsuarioPage()
