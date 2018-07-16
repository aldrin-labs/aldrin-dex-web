import gql from 'graphql-tag'

export const getCoinsForOptimization = gql`
  query getPortfolio {
    getProfile {
      portfolioId
      portfolio {
        assets {
          _id
          value
          asset {
            _id
            name
            symbol
            priceUSD
            priceBTC
          }
        }
      }
    }
  }
`
