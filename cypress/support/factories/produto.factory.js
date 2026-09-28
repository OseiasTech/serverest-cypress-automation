const { _ } = Cypress

/**
 * Gera um produto válido e com nome único para a ServeRest.
 * @param {object} [sobrescritas] campos que substituem os valores padrão
 */
export const gerarProduto = (sobrescritas = {}) => ({
  nome: `Produto Cypress ${Date.now()}${_.random(1000, 9999)}`,
  preco: _.random(10, 500),
  descricao: 'Produto criado por teste automatizado',
  quantidade: _.random(1, 100),
  ...sobrescritas,
})
