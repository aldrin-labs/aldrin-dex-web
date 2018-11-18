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
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1]

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`
          },
        },
      },
    },
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
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
