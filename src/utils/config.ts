// change return here to just URL to fallback to
// main apiURL even on localhost
// should be convinent when develop.api is down
const addDevelopToURL = (URL: string) => `develop.${URL}`
const chooseURL = (isMaster: boolean, URL: string) =>
  isMaster ? URL : addDevelopToURL(URL)

// change default api here
const apiURL = 'api.cryptocurrencies.ai'
const chartURL = 'chart.cryptocurrencies.ai'

// configuring master build at Package.json it should be
//  undefined as default and "true" at master builds
export const MASTER_BUILD = process.env.MASTER_BUILD
export const PRODUCTION = process.env.NODE_ENV === 'production'
export const API_URL = chooseURL(Boolean(process.env.MASTER_BUILD), apiURL)
export const CHARTS_API_URL = chooseURL(
  Boolean(process.env.MASTER_BUILD),
  chartURL
)
