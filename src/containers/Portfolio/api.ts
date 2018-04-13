import gql from 'graphql-tag'

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
            name
            symbol
            priceUSD
            priceBTC
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
