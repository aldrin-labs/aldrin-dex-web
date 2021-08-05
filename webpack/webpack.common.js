const commonPaths = require('./common-paths')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const getTransformer = require('ts-transform-graphql-tag').getTransformer
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const config = {
  node: {
    fs: 'empty'
  },
  output: {
    path: commonPaths.outputPath,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.web.js', '.mjs', '.ts', '.tsx'],
    alias: {
      '@sb': path.join(
        __dirname,
        '..',
        'src',
        'storybook',
        'src',
        'web'
      ),
      '@core': path.join(
        __dirname,
        '..',
        'src',
        'core',
        'src',
      ),
      '@routes': path.join(__dirname, '..', 'src', 'routes'),
      '@utils': path.join(__dirname, '..', 'src', 'utils'),
      '@icons': path.join(__dirname, '..', 'src', 'storybook', 'src', 'icons'),
      '@webhooks': path.join(__dirname, '..', 'src', 'storybook', 'src', 'webhooks'),
      '@storage': path.join(__dirname, '..', 'src', 'utils', 'storage'),
      '@nodemodules': path.resolve(__dirname, '..', 'node_modules'),
      '@material-ui/core': '@material-ui/core/es',
      '@material-ui/styles': '@material-ui/core/es/styles',
      'lodash-es': 'lodash',
      
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [
          path.join(__dirname, '../node_modules/'),
          path.join(__dirname, '../src/storybook/node_modules/'),
          path.join(__dirname, '../src/core/node_modules/'),

        ],
        use: [
          'babel-loader?cacheDirectory=true', {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({ before: [getTransformer()] })
            }
          }],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: [
          path.join(__dirname, '../node_modules/'),
          path.join(__dirname, '../src/storybook/node_modules/'),
          path.join(__dirname, '../src/core/node_modules/'),
        ],
        use: ['graphql-tag/loader', 'minify-graphql-loader'],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      // remove this as this dublicated by image webpack loader
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          limit: 4096, // 4kb
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        // include: /node_modules/,
        loaders: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new CopyPlugin([
      { from: path.join(__dirname, '..', 'public'), },
      {
        from: path.join(__dirname, '..', 'node_modules', 'cryptocurrency-icons', 'svg', 'icon'),
        to: path.join(commonPaths.outputPath, 'cryptocurrency-icons', 'svg', 'icon')
      },
    ]),
  ],
}

module.exports = config
