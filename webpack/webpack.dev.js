const commonPaths = require('./common-paths')
const Jarvis = require('webpack-jarvis')

const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const port = process.env.PORT || 3000
const devtool = process.env.DEVTOOL || 'cheap-module-source-map'

const config = {
  mode: 'development',
  entry: {
    app: ['react-hot-loader/patch', `${commonPaths.appEntry}/index.tsx`],
  },
  output: {
    filename: 'bundle.[hash].js',
  },
  devtool,
  module: {},
  stats: 'verbose',
  plugins: [
    new ErrorOverlayPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new HardSourceWebpackPlugin({
      // Either an absolute path or relative to webpack's options.context.
      cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
      // Either a string of object hash function given a webpack config.
      configHash: function(webpackConfig) {
        // node-object-hash on npm can be used to build this.
        return require('node-object-hash')({ sort: false }).hash(webpackConfig)
      },
      // Either false, a string, an object, or a project hashing function.
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock'],
      },
      // An object.
      info: {
        // 'none' or 'test'.
        mode: 'none',
        // 'debug', 'log', 'info', 'warn', or 'error'.
        level: 'debug',
      },
      // Clean up large, old caches automatically.
      cachePrune: {
        // Caches younger than `maxAge` are not considered for deletion. They must
        // be at least this (default: 2 days) old in milliseconds.
        maxAge: 2 * 24 * 60 * 60 * 1000,
        // All caches together must be larger than `sizeThreshold` before any
        // caches will be deleted. Together they must be at least this
        // (default: 50 MB) big in bytes.
        sizeThreshold: 50 * 1024 * 1024,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
        CHARTS_API_ENDPOINT: JSON.stringify(process.env.CHARTS_API_ENDPOINT),
      },
    }),
  ],
  cache: true,
  devServer: {
    host: 'localhost',
    port,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
}

module.exports = config
