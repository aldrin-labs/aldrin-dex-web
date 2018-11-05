export const API_URL =
  process.env.API_ENDPOINT || 'develop.api.cryptocurrencies.ai'
export const CHARTS_API_URL =
  process.env.CHARTS_API_ENDPOINT || 'develop.chart.cryptocurrencies.ai'
// asume that it is master build and not develop one
export const MASTER_BUILD = process.env.NODE_BUILD === 'master'
