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
  ],
  rules: {
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
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
    ],
    'react/jsx-props-no-spreading': ['error', {
      'html': 'ignore',
    }
    ],
    'no-bitwise': 'off',
    'no-underscore-dangle': 'off',
    'max-classes-per-file': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve('./webpack/webpack.common.js'),
      },
    },
  },
}
