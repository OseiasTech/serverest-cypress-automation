const { _ } = Cypress

const sufixoUnico = () => `${Date.now()}${_.random(1000, 9999)}`

/**
 * Gera um usuário válido e único para a ServeRest.
 * @param {object} [sobrescritas] campos que substituem os valores padrão
 */
export const gerarUsuario = (sobrescritas = {}) => {
  const sufixo = sufixoUnico()

  return {
    nome: `QA Cypress ${sufixo}`,
    email: `qa.cypress.${sufixo}@teste.com`,
    password: `Senha@${sufixo}`,
    administrador: 'false',
    ...sobrescritas,
  }
}

export const gerarAdministrador = (sobrescritas = {}) =>
  gerarUsuario({ administrador: 'true', ...sobrescritas })
