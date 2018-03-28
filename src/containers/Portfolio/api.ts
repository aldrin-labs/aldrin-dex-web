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
          realizedProfit
          unrealizedProfit
          totalProfit
          asset {
            name
            symbol
            priceUSD
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
