const commonPaths = require('./common-paths')

const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
  entry: {
    app: [`${commonPaths.appEntry}/index.tsx`],
  },
  output: {
    filename: 'static/[name].[hash].js',
  },
  devtool: 'source-map',
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_ENDPOINT: 'api.igorlimansky.me'
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
