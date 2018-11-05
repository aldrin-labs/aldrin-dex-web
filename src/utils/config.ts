const apiLocalhostFallback = 'develop.api.cryptocurrencies.ai'
const apiChartLocalhostFallback = 'develop.chart.cryptocurrencies.ai'

export const API_URL =
  // from netlify.toml or localhostfallback
  process.env.API_ENDPOINT || apiLocalhostFallback
export const CHARTS_API_URL =
  process.env.CHARTS_API_ENDPOINT || apiChartLocalhostFallback
// asume that it is master build and not develop one
export const MASTER_BUILD = process.env.NODE_BUILD === 'master'
