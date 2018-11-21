module.exports = {
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: ['last 2 versions'],
            },
          },
        ],
        [
          '@babel/stage-1',
          {
            decoratorsLegacy: true,
          },
        ],
        '@babel/react',
        '@babel/preset-typescript',
      ],
      plugins: [
        'react-hot-loader/babel',
        'styled-components',
        'graphql-tag',
        [
          '@babel/plugin-transform-runtime',
          {
            helpers: false,
            polyfill: false,
            regenerator: true,
            moduleName: '@babel/runtime',
          },
        ],
      ],
    },
    production: {
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            targets: {
              browsers: ['last 2 Chrome versions'],
            },
            modules: false,
          },
        ],
        [
          '@babel/stage-1',
          {
            decoratorsLegacy: true,
          },
        ],
        '@babel/react',
        '@babel/preset-typescript',
      ],
      plugins: [
        'lodash',
        'graphql-tag',
        '@babel/plugin-transform-react-inline-elements',
        [
          '@babel/plugin-transform-runtime',
          {
            polyfill: false,
            regenerator: true,
            useESModules: true,
          },
        ],
      ],
    },
    development: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: ['last 2 versions'],
            },
            modules: false,
          },
        ],
        [
          '@babel/stage-1',
          {
            decoratorsLegacy: true,
          },
        ],
        '@babel/react',
        '@babel/preset-typescript',
      ],
      plugins: [
        'react-hot-loader/babel',
        'styled-components',
        'graphql-tag',
        [
          '@babel/plugin-transform-runtime',
          {
            helpers: false,
            polyfill: false,
            regenerator: true,
            moduleName: '@babel/runtime',
          },
        ],
      ],
    },
  },
}
