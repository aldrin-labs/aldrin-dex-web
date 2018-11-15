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

export const MARKETS_BY_EXCHANE_QUERY = gql`
  query getMarketsByExchange($exchange: String!, $splitter: String!) {
    getMarketsByExchange(exchange: $exchange, splitter: $splitter) {
      symbol
    }
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
    return {}
  }
  const newTicker = subscriptionData.data.listenMarketTickers
  return { marketTickers: [newTicker] }
}

// OrderBook
export const MARKET_ORDERS = gql`
  subscription listenMarketOrders($symbol: String!, $exchange: String!) {
    listenMarketOrders(symbol: $symbol, exchange: $exchange)
  }
`

export const ORDERS_MARKET_QUERY = gql`
  query marketOrders($symbol: String!, $exchange: String!) {
    marketOrders(symbol: $symbol, exchange: $exchange)
  }
`

export const updateOrderBookQuerryFunction = (prev, { subscriptionData }) => {
  if (!subscriptionData.data) {
    return {}
  }

  const newOrder = JSON.parse(subscriptionData.data.listenMarketOrders)

  return newOrder
}
