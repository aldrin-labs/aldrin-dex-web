const util = require('util')

module.exports = {
  src: `${__dirname}/icons/*.png`,
  destImage: `${__dirname}/output/token-icons.png`,
  destCSS: `.${__dirname}/output/token-icons.css`,
  imgPath: './token-icons.png',
  padding: 0,
  engine: require('canvassmith'),
  cssOpts: {
    cssClass: (item) => {
      return util.format('.token-icon-%s:before', item.name)
    },
  },
}
