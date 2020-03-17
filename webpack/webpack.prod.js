const commonPaths = require('./common-paths')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxWebpackPlugin = require("workbox-webpack-plugin")
const ImageminPlugin = require('imagemin-webpack-plugin').default
const devtool = process.env.DEVTOOL || 'nosources-source-map'

const config = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom'],
    app: [`${commonPaths.appEntry}/index.tsx`],
  },
  output: {
    filename: 'static/[name].[hash].js',
    chunkFilename: '[name].[hash].bundle.js',
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
  },
  // optimization: {
  //   splitChunks: {
  //     maxAsyncRequests: 100,
  //     maxSize: 244,
  //   }
  // },
  // optimization:{
  //   minimize: false, // <---- disables uglify.
  //   // minimizer: [new UglifyJsPlugin()] if you want to customize it.
  // },
  // optimization: {
    // runtimeChunk: 'single',
    // splitChunks: {
    //   chunks: 'all',
    //   maxInitialRequests: Infinity,
    //   minSize: 0,
    //   cacheGroups: {
    //     app: {
    //       test: /[\\/]src[\\/]/,
    //       name(module) {
    //         const packageName = module.context
    //         console.log('packageName', packageName)
    //       }
    //     },
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name(module) {
    //         // get the name. E.g. node_modules/packageName/not/this/part.js
    //         // or node_modules/packageName
    //         const packageName = module.context.match(
    //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/
    //         )[1]

    //         // npm package names are URL-safe, but some servers don't like @ symbols
    //         return `npm.${packageName.replace('@', '')}`
    //       },
    //     },
    //   },
    // },
  // },
  plugins: [
    new ImageminPlugin({ test: /\.(jpe?g|png)$/i }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HashedModuleIdsPlugin(),
    new LodashModuleReplacementPlugin({
      caching: true,
      paths: true,
      shorthands: true,
      // Necessary as a workaround for https://github.com/apollographql/react-apollo/issues/1831
      flattening: true,
    }),
    // new UglifyJSPlugin({
    //   parallel: true,
    //   uglifyOptions: {
    //     compress: false,
    //     ecma: 6,
    //     mangle: true,
    //     toplevel: true,
    //   },
    //   sourceMap: true,
    // }),
    // new WorkboxWebpackPlugin.GenerateSW({
    //   swDest: "sw.js",
    //   clientsClaim: true,
    //   skipWaiting: false,
    //   runtimeCaching: [{
    //     urlPattern: /https:\/\/(develop.|)chart\.cryptocurrencies\.ai\/charting_library\/static\/.*/g,
    //     handler: 'StaleWhileRevalidate'
    //   }]
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
        MASTER_BUILD: JSON.stringify(process.env.MASTER_BUILD),
        CHARTS_API_ENDPOINT: JSON.stringify(process.env.CHARTS_API_ENDPOINT),
        PLATFORM: JSON.stringify('web'),
      },
    }),
  ],
}

module.exports = config
