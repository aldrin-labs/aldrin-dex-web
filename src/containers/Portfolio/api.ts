import gql from 'graphql-tag'

import { KeyFragment } from '@graphql/fragments'

export const PRICE_HISTORY_QUERY = gql`
  query priceHistoryQuery(
    $coins: [String!]
    $isBTC: Boolean!
    $unixTimestampFrom: Int!
    $unixTimestampTo: Int!
  ) {
    getPriceHistory(
      coins: $coins
      isBTC: $isBTC
      unixTimestampFrom: $unixTimestampFrom
      unixTimestampTo: $unixTimestampTo
      period: 3600
    ) {
      coins
      dates
      prices
    }
  }
`

export const UPDATE_PORTFOLIO = gql`
  mutation updatePortfolio {
    updatePortfolio
  }
`

export const CORRELATION_UPDATE = gql`
  subscription onCorrelationUpdated {
    matrix
  }
`

export const getCorrelationQuery = gql`
  query getPortfolio($startDate: Int!, $endDate: Int!) {
    correlationMatrixByDay(startDate: $startDate, endDate: $endDate)
  }
`

export const getKeysQuery = gql`
  query getKeys {
    myPortfolios {
      keys {
        _id
        name
        date
        apiKey
      }
    }
  }
`

export const getWalletsQuery = gql`
  query getWallets {
    myPortfolios {
      cryptoWallets {
        _id
        name
      }
    }
  }
`

export const getPortfolioQuery = gql`
  query getPortfolio {
    getProfile {
      portfolio {
        cryptoWallets {
          ...CryptoWalletFragmentWithAssets
        }
        assetIds
        ownerId
        portfolioPerformance {
          coin
          btc
          usd
        }
        assets {
          quantity
          asset {
            name
            symbol
            priceUSD
            priceBTC
            industry {
              name
              performance {
                usdWeek
                usdMonth
                usd3Months
                usdYear
                btcWeek
                btcMonth
                btc3Months
                btcYear
              }
            }
          }
          exchange {
            name
          }
          key {
            name
            apiKey
          }
        }
      }
    }
  }
`
export const getPortfolioMainQuery = gql`
  query getPortfolio($baseCoin: String!) {
    myPortfolios {
      name
      portfolioAssets(base: $baseCoin) {
        _id
        coin
        name
        where
        price
        quantity
        realized
        unrealized
      }
    }
  }
`
