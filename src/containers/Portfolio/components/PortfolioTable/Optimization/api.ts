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
export const OPTIMIZE_PORTFOLIO = gql`
  query getPortfolio(
    $expectedPct: Float!
    $coinList: [String!]
    $startDate: Int!
    $endDate: Int!
  ) {
    portfolioOptimization(
      expectedPct: $expectedPct
      coinList: $coinList
      startDate: $startDate
      endDate: $endDate
    )
  }
`
