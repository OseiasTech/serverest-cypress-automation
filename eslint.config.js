const js = require('@eslint/js')
const globals = require('globals')
const pluginCypress = require('eslint-plugin-cypress')

module.exports = [
  {
    ignores: ['node_modules/', 'cypress/screenshots/', 'cypress/videos/', 'cypress/downloads/'],
  },
  js.configs.recommended,
  pluginCypress.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/unsafe-to-chain-command': 'error',
    },
  },
]
