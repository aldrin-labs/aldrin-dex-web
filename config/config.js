const path = require('path')

module.exports = {
  template: {
    title: 'Crypto',
    templatePath: 'public/index.html',
  },
  production: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRootPath: path.resolve(__dirname, '../dist'),
    assetsStaticPath: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
  },
  development: {
    port: process.env.PORT || 8000,
    assetsRootPath: path.resolve(__dirname, '../dist'),
    assetsStaticPath: 'static',
    assetsPublicPath: '/',
    autoOpenBrowser: true,
    proxyTable: {},
    cssSourceMap: false,
  },
}
