import gql from 'graphql-tag'

export const MyTradesQuery = gql`
  query myPortfolios {
    portfolioActions {
      coin
      type
      where
      coin
      date
    }
  }
`
