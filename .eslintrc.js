//eslint-disable 
const path = require('path')

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ["**/*.eslintrc.js"],
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended'
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
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error']
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve('./webpack/webpack.common.js'),
      },
    },
  },
}
