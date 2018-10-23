import gql from 'graphql-tag'

export const MyTradesQuery = gql`
  query portfolios {
    myPortfolios {
      name
      portfolioActions {
        coin
        type
        cost
        where
        date
      }
    }
  }
`
