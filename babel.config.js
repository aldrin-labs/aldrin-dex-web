module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // alternative mode: "entry"
        corejs: 3, // default would be 2
        targets: '> 0.25%, not dead',
      },
    ],
    [
      '@babel/preset-react',
      {
        development: process.env.NODE_ENV === 'development',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    'react-hot-loader/babel',
    'graphql-tag',
    'babel-plugin-styled-components',
  ],
}
