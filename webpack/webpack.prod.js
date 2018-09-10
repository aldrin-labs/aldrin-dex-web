const commonPaths = require('./common-paths')

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
          ecma: 8,
          warnings: true,
          mangle: false,
          keep_fnames: true,
          output: {
            beautify: false,
            comments: false,
          },
        },
      }),
    ],
    //  implement this in future
    // https://medium.com/@hpux/webpack-4-in-production-how-make-your-life-easier-4d03e2e5b081
    // splitChunks: {
    //   cacheGroups: {
    //     default: false,
    //     commons: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendor_app',
    //       chunks: 'all',
    //       minChunks: 2,
    //     },
    //   },
    // },
    runtimeChunk: false,
  },
  plugins: [
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
