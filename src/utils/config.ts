// https://www.netlify.com/docs/continuous-deployment/#build-environment-variables
//  process.env.URL are coming from netlify
const developURL = 'https://develop.beta.cryptocurrencies.ai'

//  also it asume that it is master build and not develop one
export const MASTER_BUILD = process.env.URL === developURL

// config URLS here
const chartURL = 'chart.cryptocurrencies.ai'
const apiURL = 'api.cryptocurrencies.ai'

const addDevelopToURL = (url: string) => `develop.${url}`

export const API_URL = !MASTER_BUILD ? addDevelopToURL(apiURL) : apiURL

export const CHARTS_API_URL = !MASTER_BUILD
  ? addDevelopToURL(chartURL)
  : chartURL

// for testing will be here temporary
window.env = {}
window.env.URL = process.env.URL
window.env.API_URL = API_URL
window.env.CHARTS_API_URL = CHARTS_API_URL
window.env.MASTER_BUILD = MASTER_BUILD
