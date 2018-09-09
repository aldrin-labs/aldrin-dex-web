import gql from 'graphql-tag'

export const PortfolioPieChart = gql`
  query PortfolioPieChart {
    getProfile {
      portfolio {
        assets {
          quantity
          asset {
            priceUSD
            priceBTC
            industry {
              name
            }
          }
        }
      }
    }
  }
`
