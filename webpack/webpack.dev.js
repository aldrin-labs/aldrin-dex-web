const commonPaths = require('./common-paths')
const Jarvis = require('webpack-jarvis')

const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

const devtool = process.env.DEVTOOL || 'source-map'
const port = process.env.PORT || 3000


const config = {
  mode: 'development',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack/hot/only-dev-server',
      `${commonPaths.appEntry}/index.tsx`,
    ],
  },
  output: {
    filename: '[name].js',
  },
  devtool,
  module: {},
  optimization:{
    minimize: false, // <---- disables uglify.
  },
  stats: 'verbose',
  plugins: [
    new ErrorOverlayPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        LOCAL_BUILD: JSON.stringify(process.env.LOCAL_BUILD),
        LOCAL_BACKEND_BUILD: JSON.stringify(process.env.LOCAL_BACKEND_BUILD),
        NODE_ENV: JSON.stringify('development'),
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
        CHARTS_API_ENDPOINT: JSON.stringify(process.env.CHARTS_API_ENDPOINT),
        PLATFORM: JSON.stringify('web'),
        REACT_APP_USDT_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS),
        REACT_APP_USDC_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS),
        REACT_APP_SOL_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_SOL_REFERRAL_FEES_ADDRESS),
        REACT_APP_WUSDT_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_WUSDT_REFERRAL_FEES_ADDRESS),
        REACT_APP_ODOP_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_ODOP_REFERRAL_FEES_ADDRESS),
        REACT_APP_TRYB_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_TRYB_REFERRAL_FEES_ADDRESS),
        REACT_APP_SRM_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_SRM_REFERRAL_FEES_ADDRESS),
        REACT_APP_ETH_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_ETH_REFERRAL_FEES_ADDRESS),
        REACT_APP_RAY_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_RAY_REFERRAL_FEES_ADDRESS),
        REACT_APP_MSOL_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_MSOL_REFERRAL_FEES_ADDRESS),

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
    compress: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    watchOptions: {
      poll: 1000,
      ignored: /node_modules/
    },
  },
}

module.exports = config
