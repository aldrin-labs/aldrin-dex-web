const commonPaths = require('./common-paths')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const config = {
  entry: {
    // vendor: ['semantic-ui-react']
  },
  output: {
    path: commonPaths.outputPath,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
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
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory=true',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
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
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      // favicon: `public/favicon.ico`
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vendor'],
    //   minChunks: Infinity
    // })
  ],
}

module.exports = config
