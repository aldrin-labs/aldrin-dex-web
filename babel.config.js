module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // alternative mode: "entry"
        corejs: 3, // default would be 2
        targets: '> 0.25%, not dead'
      },
    ],
    '@babel/react',
    '@babel/preset-typescript',
  ],
  plugins: [
    'graphql-tag',
  ]
  env: {
    // test: {
    //   presets: [
    //     [
    //       '@babel/preset-env',
    //       {
    //         modules: false,
    //         targets: {
    //           browsers: ['last 2 versions'],
    //         },
    //       },
    //     ],
    //     '@babel/react',
    //     '@babel/preset-typescript',
    //   ],
    //   plugins: [
    //     'react-hot-loader/babel',
    //     [
    //       'babel-plugin-styled-components',
    //       {
    //         minify: true,
    //         transpileTemplateLiterals: true,
    //         pure: true,
    //       },
    //     ],
    //     'graphql-tag',
    //     '@babel/plugin-syntax-dynamic-import',
    //     ['@babel/plugin-proposal-decorators', { legacy: true }],
    //     ['@babel/plugin-proposal-class-properties', { loose: true }],
    //     '@babel/plugin-proposal-export-default-from',
    //     '@babel/plugin-proposal-export-namespace-from',
    //     '@babel/plugin-proposal-function-sent',
    //     '@babel/plugin-proposal-json-strings',
    //     '@babel/plugin-proposal-logical-assignment-operators',
    //     '@babel/plugin-proposal-nullish-coalescing-operator',
    //     '@babel/plugin-proposal-numeric-separator',
    //     '@babel/plugin-proposal-optional-chaining',
    //     ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    //     '@babel/plugin-proposal-throw-expressions',
    //     '@babel/plugin-syntax-import-meta',
    //     '@babel/plugin-transform-react-inline-elements',
    //   ],
    // },
    // production: {
    //   presets: [
    //     [
    //       '@babel/preset-env',
    //       {
    //         useBuiltIns: 'usage',
    //         targets: {
    //           browsers: ['last 2 Chrome versions'],
    //         },
    //         modules: false,
    //       },
    //     ],
    //     '@babel/react',
    //     '@babel/preset-typescript',
    //   ],
    //   plugins: [
    //     'graphql-tag',
    //     [
    //       'babel-plugin-styled-components',
    //       {
    //         minify: true,
    //         transpileTemplateLiterals: true,
    //         pure: true,
    //       },
    //     ],
    //     ['transform-react-remove-prop-types'],
    //     '@babel/plugin-syntax-dynamic-import',
    //     ['@babel/plugin-proposal-decorators', { legacy: true }],
    //     ['@babel/plugin-proposal-class-properties', { loose: true }],
    //     '@babel/plugin-proposal-export-default-from',
    //     '@babel/plugin-proposal-export-namespace-from',
    //     '@babel/plugin-proposal-function-sent',
    //     '@babel/plugin-proposal-json-strings',
    //     '@babel/plugin-proposal-logical-assignment-operators',
    //     '@babel/plugin-proposal-nullish-coalescing-operator',
    //     '@babel/plugin-proposal-numeric-separator',
    //     '@babel/plugin-proposal-optional-chaining',
    //     ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    //     '@babel/plugin-proposal-throw-expressions',
    //     '@babel/plugin-syntax-import-meta',
    //     '@babel/plugin-transform-react-inline-elements',
    //   ],
    // },
    // development: {
    //   presets: [
    //     [
    //       '@babel/preset-env',
    //       {
    //         targets: {
    //           browsers: ['last 2 versions'],
    //         },
    //         modules: false,
    //       },
    //     ],
    //     '@babel/react',
    //     '@babel/preset-typescript',
    //   ],
    //   plugins: [
    //     // 'react-hot-loader/babel',
    //     // [
    //     //   'babel-plugin-styled-components',
    //     //   {
    //     //     minify: true,
    //     //     transpileTemplateLiterals: true,
    //     //     pure: true,
    //     //   },
    //     // ],
    //     // 'graphql-tag',
    //     // [
    //     //   '@babel/plugin-transform-runtime',
    //     //   {
    //     //     helpers: false,
    //     //     regenerator: true,
    //     //   },
    //     // ],
    //     // '@babel/plugin-syntax-dynamic-import',
    //     // ['@babel/plugin-proposal-decorators', { legacy: true }],
    //     // ['@babel/plugin-proposal-class-properties', { loose: true }],
    //     // '@babel/plugin-proposal-export-default-from',
    //     // '@babel/plugin-proposal-export-namespace-from',
    //     // '@babel/plugin-proposal-function-sent',
    //     // '@babel/plugin-proposal-json-strings',
    //     // '@babel/plugin-proposal-logical-assignment-operators',
    //     // '@babel/plugin-proposal-nullish-coalescing-operator',
    //     // '@babel/plugin-proposal-numeric-separator',
    //     // '@babel/plugin-proposal-optional-chaining',
    //     // ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    //     // '@babel/plugin-proposal-throw-expressions',
    //     // '@babel/plugin-syntax-import-meta',
    //     // '@babel/plugin-transform-react-inline-elements',
    //   ],
    // },
  },
}
