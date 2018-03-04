import gql from 'graphql-tag'

export const getPortfolio = gql`
  query gerPortfolio {
    getProfile {
      username
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
      portfolio {
        assetIds
        assets {
          _id
          value
          realizedProfit
          possibleProfit
          asset {
            name
            symbol
            totalSupply
            maxSupply
          }
          exchange {
            name
            symbol
          }
          key {
            name
          }
        }
      }
    }
  }
`
