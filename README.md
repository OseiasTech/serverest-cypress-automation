# ServeRest - Automação de testes com Cypress

[![Cypress Tests](https://github.com/OseiasTech/serverest-cypress-automation/actions/workflows/cypress.yml/badge.svg)](https://github.com/OseiasTech/serverest-cypress-automation/actions/workflows/cypress.yml)

Testes automatizados **E2E (frontend)** e de **API** da aplicação [ServeRest](https://serverest.dev), escritos com Cypress e JavaScript.

| Camada   | Endereço                                                 |
| -------- | -------------------------------------------------------- |
| Frontend | [front.serverest.dev](https://front.serverest.dev/)      |
| API      | [serverest.dev](https://serverest.dev/) (Swagger)        |

## Cenários

São 20 cenários: 10 de frontend e 10 de API, organizados em pastas por funcionalidade.

### Frontend (`cypress/e2e/frontend`) - 10 cenários

| Pasta          | Spec                      | Casos de teste                                                            |
| -------------- | ------------------------- | ------------------------------------------------------------------------- |
| `autenticacao` | `login.cy.js`             | Login válido; senha inválida; logout                                      |
| `autenticacao` | `cadastro-usuario.cy.js`  | Cadastro com sucesso e redirecionamento para a home; e-mail já utilizado  |
| `loja`         | `pesquisa-produtos.cy.js` | Mensagem quando nenhum produto é encontrado                               |
| `loja`         | `lista-compras.cy.js`     | Pesquisar produto e adicioná-lo à lista; limpar a lista                   |
| `admin`        | `gestao-produtos.cy.js`   | Cadastrar produto (com upload de imagem) e vê-lo na listagem; excluir produto |

### API (`cypress/e2e/api`) - 10 cenários

| Pasta       | Spec                      | Casos de teste                                                                 |
| ----------- | ------------------------- | ------------------------------------------------------------------------------ |
| `usuarios`  | `cadastro-usuario.cy.js`  | Cadastro e consulta por id (201/200); e-mail duplicado (400)                   |
| `usuarios`  | `edicao-usuario.cy.js`    | Atualização de dados do usuário (200)                                          |
| `login`     | `login.cy.js`             | Login válido com token Bearer (200); senha incorreta (401)                     |
| `produtos`  | `cadastro-produto.cy.js`  | Cadastro por administrador (201); nome duplicado (400); não administrador (403) |
| `carrinhos` | `carrinho.cy.js`          | Cadastro com cálculo de totais e baixa de estoque (201); cancelamento com devolução do estoque (200) |

## Estrutura do projeto

```
cypress/
├── e2e/
│   ├── api/                      # Specs de API (cy.request)
│   │   ├── carrinhos/
│   │   ├── login/
│   │   ├── produtos/
│   │   └── usuarios/
│   └── frontend/                 # Specs E2E da interface
│       ├── admin/                # Área do administrador
│       ├── autenticacao/         # Login, logout e cadastro
│       └── loja/                 # Pesquisa e lista de compras
├── fixtures/
│   ├── imagens/produto.png       # Imagem usada no upload do cadastro de produto
│   └── mensagens.json            # Mensagens esperadas da aplicação
└── support/
    ├── commands/
    │   ├── api.js                # Custom commands para os endpoints da API
    │   └── ui.js                 # Login pela interface com cy.session
    ├── factories/                # Geração de massa de dados única por execução
    ├── pages/                    # Page Objects
    │   └── admin/
    └── e2e.js
```

O arquivo [BUGS.txt](BUGS.txt) reúne os bugs encontrados durante a automação, separados em backend e frontend e descritos em Gherkin.

## Decisões e boas práticas

- **Page Object Model**: seletores e ações de cada tela ficam isolados em `support/pages`, deixando as specs focadas no comportamento.
- **Custom Commands** para a API: reutilizados nos testes de API e no setup/teardown dos testes E2E.
- **Factories** geram dados únicos (`Date.now` + `Cypress._`), sem dependências externas, então os testes podem rodar em paralelo e repetidamente.
- **Testes independentes**: cada spec cria a própria massa via API e a remove no final (`after`/`afterEach`), sem depender de dados pré-existentes. No carrinho, a compra é cancelada após cada teste para liberar a exclusão de usuário e produto.
- **Setup via API, validação via UI**: pré-condições (usuários, produtos) são criadas por `cy.request`, e só o fluxo sob teste passa pela interface.
- **Recursos nativos do Cypress**: `cy.request`, `cy.intercept`/`cy.wait`, `cy.session`, `cy.fixture`, `cy.selectFile`, `Cypress._`, `Cypress.expose` e retries configurados no `cypress.config.js`.
- **Seletores estáveis**: uso dos atributos `data-testid` da aplicação.
- **Sem esperas fixas**: nenhum `cy.wait(ms)`; as assertivas usam a retentativa automática do Cypress (regra `cypress/no-unnecessary-waiting` no ESLint).
- **CI** com GitHub Actions: lint e depois as suítes de API e frontend em paralelo (matrix), publicando screenshots quando há falha.

## Pré-requisitos

- Node.js 20+
- Google Chrome (os scripts rodam com `--browser chrome`, pois o Electron está depreciado no Cypress)
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
