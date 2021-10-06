const commonPaths = require('./common-paths')

const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const devtool = process.env.DEVTOOL || 'nosources-source-map'


const config = {
  mode: 'production',
  entry: {
    app: [`${commonPaths.appEntry}/index.tsx`],
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].bundle.js',
  },
  devtool,
  module: {
    rules: [],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          toplevel: true,
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic'
  },

  plugins: [
    new ImageMinimizerPlugin({
      test: /\.(jpe?g|png)$/i,
      minimizerOptions: {
        plugins: [
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
        ]
      }
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
        MASTER_BUILD: JSON.stringify(process.env.MASTER_BUILD),
        CHARTS_API_ENDPOINT: JSON.stringify(process.env.CHARTS_API_ENDPOINT),
        PLATFORM: JSON.stringify('web'),
        LOCAL_BACKEND_BUILD: JSON.stringify(process.env.LOCAL_BACKEND_BUILD),
        REACT_APP_USDT_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_USDT_REFERRAL_FEES_ADDRESS),
        REACT_APP_USDC_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_USDC_REFERRAL_FEES_ADDRESS),
        REACT_APP_SOL_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_SOL_REFERRAL_FEES_ADDRESS),
        REACT_APP_WUSDT_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_WUSDT_REFERRAL_FEES_ADDRESS),
        REACT_APP_ODOP_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_ODOP_REFERRAL_FEES_ADDRESS),
        REACT_APP_TRYB_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_TRYB_REFERRAL_FEES_ADDRESS),
        REACT_APP_SRM_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_SRM_REFERRAL_FEES_ADDRESS),
        REACT_APP_ETH_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_ETH_REFERRAL_FEES_ADDRESS),
        REACT_APP_RAY_REFERRAL_FEES_ADDRESS: JSON.stringify(process.env.REACT_APP_RAY_REFERRAL_FEES_ADDRESS),
      },
    }),
  ],
}

module.exports = config
