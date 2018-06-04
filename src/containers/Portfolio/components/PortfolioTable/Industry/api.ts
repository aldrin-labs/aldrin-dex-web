import gql from 'graphql-tag'

export const PortfolioPieChart = gql`
  query PortfolioPieChart {
    getProfile {
      portfolio {
        assets {
          value
          asset {
            industry {
              name
            }
          }
        }
      }
    }
  }
`
