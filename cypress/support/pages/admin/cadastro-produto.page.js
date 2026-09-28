class AdminCadastroProdutoPage {
  elementos = {
    nome: () => cy.get('[data-testid="nome"]'),
    preco: () => cy.get('[data-testid="preco"]'),
    descricao: () => cy.get('[data-testid="descricao"]'),
    quantidade: () => cy.get('[data-testid="quantity"]'),
    imagem: () => cy.get('[data-testid="imagem"]'),
    // O data-testid da aplicação tem erro de digitação ("cadastar")
    botaoCadastrar: () => cy.get('[data-testid="cadastarProdutos"]'),
  }

  visitar() {
    cy.visit('/admin/cadastrarprodutos')
    return this
  }

  cadastrar({ nome, preco, descricao, quantidade }, imagem = 'cypress/fixtures/imagens/produto.png') {
    this.elementos.nome().type(nome)
    this.elementos.preco().type(String(preco))
    this.elementos.descricao().type(descricao)
    this.elementos.quantidade().type(String(quantidade))
    this.elementos.imagem().selectFile(imagem)
    this.elementos.botaoCadastrar().click()
    return this
  }
}

export default new AdminCadastroProdutoPage()
