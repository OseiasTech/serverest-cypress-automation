class AdminListaProdutosPage {
  elementos = {
    titulo: () => cy.get('h1'),
    linhaProduto: (nome) => cy.contains('table tbody tr', nome),
  }

  visitar() {
    cy.visit('/admin/listarprodutos')
    return this
  }

  excluirProduto(nome) {
    this.elementos.linhaProduto(nome).contains('button', 'Excluir').click()
    return this
  }
}

export default new AdminListaProdutosPage()
