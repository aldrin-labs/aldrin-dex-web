const webpackConfig = require('./webpack.config.babel');
console.log('start');
const webpack = require("webpack");
console.log('required webpack')
const jm = require('js-meter')

process.env.DEVTOOL = "cheap-source-map";
process.env.NODE_OPTIONS = "--max_old_space_size=4096";
process.env.NODE_ENV = "production";
process.env.API_ENDPOINT = "develop.api.cryptocurrencies.ai";
process.env.CHARTS_API_ENDPOINT = "develop.chart.cryptocurrencies.ai";
console.log(process.env.NODE_OPTIONS);

const isPrint = true
const isMs = true       // or Second
const isKb = true 
const m = new jm({isPrint, isMs, isKb})

const compiler = webpack(webpackConfig({ env: 'prod' }));

compiler.run((err, stats) => {
  console.log('finish');
  const meter = m.stop();
});
