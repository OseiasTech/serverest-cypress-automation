/**
 * Comandos de API da ServeRest.
 * Todos aceitam `options` repassadas ao cy.request (ex.: { failOnStatusCode: false })
 * para permitir o uso tanto em setup/teardown quanto em cenários negativos.
 */
const apiUrl = () => Cypress.expose('apiUrl')

const autorizacao = (token) => (token ? { Authorization: token } : {})

Cypress.Commands.add('apiCadastrarUsuario', (usuario, options = {}) =>
  cy.request({
    method: 'POST',
    url: `${apiUrl()}/usuarios`,
    body: usuario,
    ...options,
  }),
)

Cypress.Commands.add('apiBuscarUsuario', (id, options = {}) =>
  cy.request({
    method: 'GET',
    url: `${apiUrl()}/usuarios/${id}`,
    ...options,
  }),
)

Cypress.Commands.add('apiExcluirUsuario', (id, options = {}) =>
  cy.request({
    method: 'DELETE',
    url: `${apiUrl()}/usuarios/${id}`,
    ...options,
  }),
)

Cypress.Commands.add('apiLogin', ({ email, password }, options = {}) =>
  cy.request({
    method: 'POST',
    url: `${apiUrl()}/login`,
    body: { email, password },
    ...options,
  }),
)

Cypress.Commands.add('apiCadastrarProduto', (produto, token, options = {}) =>
  cy.request({
    method: 'POST',
    url: `${apiUrl()}/produtos`,
    headers: autorizacao(token),
    body: produto,
    ...options,
  }),
)

Cypress.Commands.add('apiBuscarProduto', (id, options = {}) =>
  cy.request({
    method: 'GET',
    url: `${apiUrl()}/produtos/${id}`,
    ...options,
  }),
)

Cypress.Commands.add('apiExcluirProduto', (id, token, options = {}) =>
  cy.request({
    method: 'DELETE',
    url: `${apiUrl()}/produtos/${id}`,
    headers: autorizacao(token),
    ...options,
  }),
)

/**
 * Cadastra um usuário e retorna seus dados acrescidos do `_id`.
 */
Cypress.Commands.add('criarUsuario', (usuario) =>
  cy.apiCadastrarUsuario(usuario).then(({ body }) => ({ ...usuario, _id: body._id })),
)

/**
 * Autentica o usuário via API e retorna o token (Bearer).
 */
Cypress.Commands.add('obterToken', (usuario) =>
  cy.apiLogin(usuario).its('body.authorization'),
)
