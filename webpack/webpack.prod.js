const commonPaths = require('./common-paths')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const devtool = process.env.DEVTOOL || 'nosources-source-map'

const config = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom', 'redux'],
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
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      caching: true,
      paths: true,
      shorthands: true,
      // Necessary as a workaround for https://github.com/apollographql/react-apollo/issues/1831
      flattening: true,
    }),
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
        MASTER_BUILD: JSON.stringify(process.env.MASTER_BUILD),
        CHARTS_API_ENDPOINT: JSON.stringify(process.env.CHARTS_API_ENDPOINT),
      },
    }),
  ],
}

module.exports = config
