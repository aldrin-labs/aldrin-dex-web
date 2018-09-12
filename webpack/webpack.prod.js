const commonPaths = require('./common-paths')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const devtool = process.env.DEVTOOL || 'nosources-source-map'

const config = {
  mode: 'production',
  entry: {
    app: [`${commonPaths.appEntry}/index.tsx`],
  },
  output: {
    filename: 'static/[name].[hash].js',
  },
  devtool,
  module: {
    rules: [],
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true,
          toplevel: true,
        },
        sourceMap: true,
      }),
    ],

    runtimeChunk: false,
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      caching: true,
      paths: true,
      shorthands: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
        CHARTS_API_ENDPOINT: JSON.stringify(process.env.CHARTS_API_ENDPOINT),
      },
    }),
  ],
}

module.exports = config
