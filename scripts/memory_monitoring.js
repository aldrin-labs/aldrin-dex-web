const webpack = require("webpack");
const memoryUsage = require('memory-usage');
const webpackConfig = require('../webpack.config.babel');

process.env.DEVTOOL = "cheap-source-map";
process.env.NODE_OPTIONS = "--max_old_space_size=4096";
process.env.NODE_ENV = "production";
process.env.API_ENDPOINT = "develop.api.cryptocurrencies.ai";
process.env.CHARTS_API_ENDPOINT = "develop.chart.cryptocurrencies.ai";

const compiler = webpack(webpackConfig({ env: 'prod' }));

var maxMemory = 0
var memoryUsageSteam = memoryUsage(500)

memoryUsageSteam.on('data', (data) => {
  if (data.rss > maxMemory) maxMemory = data.rss
})

compiler.run((err, stats) => {
  console.log('max memory =', maxMemory / 1048576, 'mb');
});
