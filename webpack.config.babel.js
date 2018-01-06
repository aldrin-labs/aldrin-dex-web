import webpack from 'webpack'
import { resolve } from 'path'
import OpenBrowserPlugin from 'open-browser-webpack-plugin'

// TODO: Add to build
// import HtmlWebpackPlugin from 'html-webpack-plugin'
// import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
// import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
// import CopyWebpackPlugin from 'copy-webpack-plugin'

const srcPath = resolve(__dirname, 'src')
const distPath = resolve(__dirname, 'dist')

const serverConfig = {
  context: srcPath,
  target: 'node',
  entry: ['babel-polyfill', './server/index.js'],
  output: {
    filename: 'server.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  resolve: {
    alias: {
      src: 'src',
      components: resolve(__dirname, './src/client/components'),
      containers: resolve(__dirname, './src/client/containers'),
    },
  },
}

const clientConfig = {
  devtool: 'cheap-module-source-map',
  context: srcPath,

  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    './client/client.js',
  ],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '',
  },

  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'build'),
    historyApiFallback: true,
    publicPath: '/',
    port: 3000,
  },

  module: {
    rules: [
      // TODO: Add hook
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      // },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/png',
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/font-woff',
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/octet-stream',
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/svg+xml',
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // TODO: Add hook
    // new webpack.LoaderOptionsPlugin({
    //   test: /\.js$/,
    //   options: {
    //     eslint: {
    //       configFile: resolve(__dirname, '.eslintrc'),
    //       cache: false,
    //     },
    //   },
    // }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new OpenBrowserPlugin({ url: 'http://localhost:3000' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      src: 'src',
      components: resolve(__dirname, './src/client/components'),
      containers: resolve(__dirname, './src/client/containers'),
    },
  },
}
// serverConfig
module.exports = [clientConfig]
