class HomePage {
  elementos = {
    titulo: () => cy.get('h1'),
    campoPesquisa: () => cy.get('[data-testid="pesquisar"]'),
    botaoPesquisar: () => cy.get('[data-testid="botaoPesquisar"]'),
    cardProduto: (nome) => cy.contains('.card', nome),
    botaoLogout: () => cy.get('[data-testid="logout"]'),
  }

  visitar() {
    cy.visit('/home')
    return this
  }

  pesquisarProduto(nome) {
    this.elementos.campoPesquisa().type(nome)
    this.elementos.botaoPesquisar().click()
    return this
  }

  adicionarNaLista(nome) {
    this.elementos.cardProduto(nome).find('[data-testid="adicionarNaLista"]').click()
    return this
  }
}

export default new HomePage()
