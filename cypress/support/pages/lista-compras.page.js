class ListaComprasPage {
  elementos = {
    titulo: () => cy.get('h1'),
    produtos: () => cy.get('[data-testid="shopping-cart-product-name"]'),
    quantidade: () => cy.get('[data-testid="shopping-cart-product-quantity"]'),
    botaoLimparLista: () => cy.get('[data-testid="limparLista"]'),
    mensagemListaVazia: () => cy.get('[data-testid="shopping-cart-empty-message"]'),
  }
}

export default new ListaComprasPage()
