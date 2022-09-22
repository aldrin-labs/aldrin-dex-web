//eslint-disable
const path = require('path')
const commonConfig = require('./src/core/eslintrc.common')

const config = {
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve('./webpack/webpack.common.js'),
      },
    },
  },
}


const mergedConfig = Object.assign({}, commonConfig, config)

module.exports = mergedConfig
