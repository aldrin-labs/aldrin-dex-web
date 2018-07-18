import gql from 'graphql-tag'

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
    getProfile {
      portfolioId
      keys {
        _id
        name
        apiKey
        secret
        date
        exchange {
          name
          symbol
        }
      }
    }
  }
`

export const getPortfolioQuery = gql`
  query getPortfolio {
    getProfile {
      portfolioId
      portfolio {
        name
        processing
        assetIds
        assets {
          _id
          assetId
          exchangeId
          keyId
          value
          usdRealizedProfit
          usdUnrealizedProfit
          usdTotalProfit
          btcRealizedProfit
          btcUnrealizedProfit
          btcTotalProfit
          asset {
            _id
            name
            symbol
            priceUSD
            priceBTC
            industry {
              name
              performance {
                usd
                btc
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
      myRebalance {
        total
        assets {
          id
          _id
          percent
          amount
          diff
        }
      }
    }
  }
`

export const updateRebalanceMutation = gql`
  mutation($input: rebalanceInput) {
    updateRebalance(input: $input) {
      total
    }
  }
`
