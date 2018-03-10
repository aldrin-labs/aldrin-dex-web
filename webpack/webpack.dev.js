const commonPaths = require('./common-paths')

const webpack = require('webpack')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin').default

const port = process.env.PORT || 3000

const config = {
  mode: 'development',
  entry: {
    app: ['react-hot-loader/patch', `${commonPaths.appEntry}/index.tsx`],
  },
  output: {
    filename: 'bundle.[hash].js',
  },
  devtool: 'inline-source-map',
  module: {},
  plugins: [
    // new ErrorOverlayPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    host: 'localhost',
    port,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
}

module.exports = config
