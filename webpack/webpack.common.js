const commonPaths = require('./common-paths')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const getTransformer = require('ts-transform-graphql-tag').getTransformer
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = {
  output: {
    path: commonPaths.outputPath,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.web.js', '.mjs', '.ts', '.tsx'],
    alias: {
      '@sb': path.join(__dirname, '..', 'src', 'storybook', 'src', 'web'),
      '@core': path.join(__dirname, '..', 'src', 'core', 'src'),
      '@routes': path.join(__dirname, '..', 'src', 'routes'),
      '@utils': path.join(__dirname, '..', 'src', 'utils'),
      '@icons': path.join(__dirname, '..', 'src', 'storybook', 'src', 'icons'),
      '@webhooks': path.join(
        __dirname,
        '..',
        'src',
        'storybook',
        'src',
        'webhooks'
      ),
      '@variables': path.join(__dirname, '..', 'src', 'storybook', 'src', 'variables'),
      '@storage': path.join(__dirname, '..', 'src', 'utils', 'storage'),
      '@nodemodules': path.resolve(__dirname, '..', 'node_modules'),
      '@material-ui/core': '@material-ui/core/es',
      '@material-ui/styles': '@material-ui/core/es/styles',
      'buffer': path.resolve(__dirname, '..', 'src', 'utils', 'buffer'),
      'react-apollo': path.resolve(__dirname, '..', 'node_modules', 'react-apollo'),
      'apollo-link-context': path.resolve(__dirname, '..', 'node_modules', 'apollo-link-context'),
      'react': path.resolve(__dirname, '..', 'node_modules', 'react'),
    },
    fallback: {
      fs: false,
      os: false,
      path: false,
      net: false,
      tls: false,
      child_process: false,
      util: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      'bigint-buffer': false,
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
          // 'babel-loader?cacheDirectory=true',
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({ before: [getTransformer()] })
            }
          },

        ],
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
        test: /\.m?js/,
        // include: /node_modules/,
        // type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
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
        test: /\.pdf$/,
        use: ["file-loader"],
      },
      {
        test: /\.(png|jpg|gif|webp)$/,
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
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        // include: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, '..', 'public'), filter: (path) => !path.endsWith('.html') },
        {
          from: path.join(__dirname, '..', 'node_modules', 'cryptocurrency-icons', 'svg', 'icon'),
          to: path.join(commonPaths.outputPath, 'cryptocurrency-icons', 'svg', 'icon')
        },
      ]
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      buffer: ['buffer', 'Buffer']
    })
  ],
}

module.exports = config
