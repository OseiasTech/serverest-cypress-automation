# ServeRest - Automação de testes com Cypress

[![Cypress Tests](https://github.com/OseiasTech/serverest-cypress-automation/actions/workflows/cypress.yml/badge.svg)](https://github.com/OseiasTech/serverest-cypress-automation/actions/workflows/cypress.yml)

Testes automatizados **E2E (frontend)** e de **API** da aplicação [ServeRest](https://serverest.dev), escritos com Cypress e JavaScript.

| Camada   | Endereço                                                 |
| -------- | -------------------------------------------------------- |
| Frontend | [front.serverest.dev](https://front.serverest.dev/)      |
| API      | [serverest.dev](https://serverest.dev/) (Swagger)        |

## Cenários

### Frontend (`cypress/e2e/frontend`)

| Funcionalidade          | Casos de teste                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| Cadastro de usuário     | Cadastro com sucesso e redirecionamento para a home; e-mail já utilizado       |
| Login                   | Login válido; senha inválida; logout                                           |
| Lista de compras        | Pesquisar produto e adicioná-lo à lista; limpar a lista                        |

### API (`cypress/e2e/api`)

| Recurso     | Casos de teste                                                                               |
| ----------- | -------------------------------------------------------------------------------------------- |
| `/usuarios` | Cadastro e consulta por id; e-mail duplicado (400)                                           |
| `/login`    | Login válido com token Bearer (200); senha incorreta (401)                                   |
| `/produtos` | Cadastro por administrador (201); nome duplicado (400); não administrador (403); sem token (401) |

## Estrutura do projeto

```
cypress/
├── e2e/
│   ├── api/                 # Specs de API (cy.request)
│   └── frontend/            # Specs E2E da interface
├── fixtures/
│   └── mensagens.json       # Mensagens esperadas da aplicação
└── support/
    ├── commands/
    │   ├── api.js           # Custom commands para os endpoints da API
    │   └── ui.js            # Login pela interface com cy.session
    ├── factories/           # Geração de massa de dados única por execução
    ├── pages/               # Page Objects
    └── e2e.js
```

## Decisões e boas práticas

- **Page Object Model**: seletores e ações de cada tela ficam isolados em `support/pages`, deixando as specs focadas no comportamento.
- **Custom Commands** para a API: reutilizados nos testes de API e no setup/teardown dos testes E2E.
- **Factories** geram dados únicos (`Date.now` + `Cypress._`), sem dependências externas, então os testes podem rodar em paralelo e repetidamente.
- **Testes independentes**: cada spec cria a própria massa via API e a remove no final (`after`/`afterEach`), sem depender de dados pré-existentes.
- **Setup via API, validação via UI**: pré-condições (usuários, produtos) são criadas por `cy.request`, e só o fluxo sob teste passa pela interface.
- **Recursos nativos do Cypress**: `cy.request`, `cy.intercept`/`cy.wait`, `cy.session`, `cy.fixture`, `Cypress._`, `Cypress.expose` e retries configurados no `cypress.config.js`.
- **Seletores estáveis**: uso dos atributos `data-testid` da aplicação.
- **Sem esperas fixas**: nenhum `cy.wait(ms)`; as assertivas usam a retentativa automática do Cypress (regra `cypress/no-unnecessary-waiting` no ESLint).
- **CI** com GitHub Actions: lint e depois as suítes de API e frontend em paralelo (matrix), publicando screenshots quando há falha.

## Pré-requisitos

- Node.js 20+
- npm

## Como executar

```bash
npm install
```

> Com npm 11+, se o binário do Cypress não for baixado automaticamente, rode `npx cypress install`.

| Comando                 | Descrição                                 |
| ----------------------- | ----------------------------------------- |
| `npm run cy:open`       | Abre o Cypress no modo interativo         |
| `npm test`              | Executa todos os testes em modo headless  |
| `npm run test:api`      | Executa somente os testes de API          |
| `npm run test:frontend` | Executa somente os testes de frontend     |
| `npm run lint`          | Executa o ESLint                          |

A URL da API é configurada em `expose.apiUrl` no `cypress.config.js` e pode ser sobrescrita pela linha de comando:

```bash
npx cypress run --expose apiUrl=http://localhost:3000
```
