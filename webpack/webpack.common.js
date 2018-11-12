const commonPaths = require('./common-paths')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  output: {
    path: commonPaths.outputPath,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.web.js', '.mjs', '.ts', '.tsx'],
    alias: {
      '@storybook-components': path.join(
        __dirname,
        '..',
        'src',
        'storybook',
        'src',
        'components'
      ),
      '@components': path.join(__dirname, '..', 'src', 'components'),
      '@containers': path.join(__dirname, '..', 'src', 'containers'),
      '@utils': path.join(__dirname, '..', 'src', 'utils'),
      '@hoc': path.join(__dirname, '..', 'src', 'hoc'),
      '@styles': path.join(__dirname, '..', 'src', 'styles'),
      '@graphql': path.join(__dirname, '..', 'src', 'graphql'),
      '@icons': path.join(__dirname, '..', 'src', 'icons'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)|(js)$/,
        exclude: [
          path.join(__dirname, '/node_modules/'),
          path.join(__dirname, '/src/storybook/node_modules/'),
        ],
        use: ['babel-loader'],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: [
          path.join(__dirname, '/node_modules/'),
          path.join(__dirname, '/src/storybook/node_modules/'),
        ],
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      // remove this as this dublicated by image webpack loader
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          limit: 4096, // 4kb
        },
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
    }),
  ],
}

module.exports = config
