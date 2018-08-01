import gql from 'graphql-tag'

export const ExchangeQuery = gql`
  query ExchangeQuery($marketName: String!) {
    marketByName(name: $marketName) {
      exchangeIds
      exchanges {
        symbol
        name
      }
    }
  }
`

export const MARKET_TICKERS = gql`
  subscription listenMarketTickers($symbol: String!, $exchange: String!) {
    listenMarketTickers(symbol: $symbol, exchange: $exchange)
  }
`

export const MARKET_QUERY = gql`
  query marketTickers($symbol: String!, $exchange: String!) {
    marketTickers(symbol: $symbol, exchange: $exchange)
  }
`

export const updateTradeHistoryQuerryFunction = (
  prev,
  { subscriptionData }
) => {
  if (!subscriptionData.data) {
    return prev
  }
  const newTicker = subscriptionData.data.listenMarketTickers
  let obj = Object.assign({}, prev, {
    marketTickers: [newTicker],
  })

  return obj
}
