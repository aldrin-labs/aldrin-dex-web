const commonPaths = require('./common-paths')

const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
          NODE_ENV: JSON.stringify('production'),
          API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT),
          CHARTS_API_ENDPOINT: JSON.stringify(process.env.CHARTS_API_ENDPOINT)
      },
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
    }),
  ],
}

module.exports = config
