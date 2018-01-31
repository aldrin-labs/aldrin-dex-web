const commonPaths = require('./common-paths')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  entry: {
    // vendor: ['semantic-ui-react']
  },
  output: {
    path: commonPaths.outputPath,
    publicPath: '/',
  },
  // resolve: {
  //   extensions: ['.js'],
  //   alias: {
  //     components: path.resolve(__dirname, '../src/components'),
  //     containers: path.resolve(__dirname, '../src/containers'),
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.[jt]sx?/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `public/index.html`,
      // favicon: `public/favicon.ico`
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vendor'],
    //   minChunks: Infinity
    // })
  ],
}

module.exports = config
