//eslint-disable
const path = require('path')

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['**/*.eslintrc.js'],
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:cypress/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'unused-imports',
    'eslint-plugin-import-helpers',
  ],
  rules: {
    'import-helpers/order-imports': [
      'error',
      { // example configuration
        newlinesBetween: 'always',
        groups: [
          'module',
          '/^@sb/',
          '/^@core/',
          '/^@icons/',
          '/^@variables/',
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-await-in-loop': 'off',
    semi: ['error', 'never'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
      }
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': 'off', // TODO
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'unused-imports/no-unused-imports': 'error',
    'react/require-default-props': 'off',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
    ],
    'react/jsx-props-no-spreading': ['warn', {
      'html': 'ignore',
    }
    ],
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-bitwise': 'off',
    'no-underscore-dangle': 'off',
    'max-classes-per-file': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used', varsIgnorePattern: '^_', argsIgnorePattern: '^_', 'ignoreRestSiblings': false }]
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve('./webpack/webpack.common.js'),
      },
    },
  },
}
