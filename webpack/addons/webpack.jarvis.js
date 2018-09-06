const Jarvis = require('webpack-jarvis')

module.exports = {
  plugins: [
    new Jarvis({
      port: 1337
    })
  ]
}
