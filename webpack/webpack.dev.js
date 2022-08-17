/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack')

// const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const commonPaths = require('./common-paths')

const devtool = process.env.DEVTOOL || 'source-map'
const port = process.env.PORT || 3000

const config = {
  mode: 'development',
  entry: {
    app: ['react-hot-loader/patch', `${commonPaths.appEntry}/index.tsx`],
  },
  output: {
    filename: '[name].js',
  },
  devtool,
  module: {},
  optimization: {
    minimize: false, // <---- disables uglify.
  },
  stats: 'normal',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        LOCAL_BUILD: JSON.stringify(process.env.LOCAL_BUILD),
        MASTER_BUILD: JSON.stringify(process.env.MASTER_BUILD),
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
        POOLS_PROGRAM_ADDRESS: JSON.stringify(process.env.POOLS_PROGRAM_ADDRESS),
        STAKING_PROGRAM_ADDRESS: JSON.stringify(process.env.STAKING_PROGRAM_ADDRESS),
        RPC_PROVIDERS_ADDRESSES: JSON.stringify(process.env.RPC_PROVIDERS_ADDRESSES),
        MOONPAY_DOMAIN: JSON.stringify(process.env.MOONPAY_DOMAIN),
        MOONPAY_API_KEY: JSON.stringify(process.env.MOONPAY_API_KEY),
      },
    }),
  ],

  devServer: {
    host: 'localhost',
    port,
    historyApiFallback: true,
    hot: true,
    open: true,
    proxy: {
      '/marinade/stats.json': {
        target: 'http://23.29.121.36:7002/metrics_json',
        pathRewrite: { '^/marinade/stats.json': '' },
      },
      '/marinade/api/': 'https://api.marinade.finance/',
    },
  },
}

module.exports = config
