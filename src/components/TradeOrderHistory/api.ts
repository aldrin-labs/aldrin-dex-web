import gql from 'graphql-tag'

export const MyTradesQuery = gql`
  query portfolios {
    myPortfolios {
      name
      portfolioActions {
        type
        where
        coin
        date
        __typename
      }
    }
  }
`
