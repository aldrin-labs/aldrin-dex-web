import gql from 'graphql-tag'

export const ExchangeQuery = gql`
  query ExchangeQuery($marketName: String!) {
    marketByName(name: $marketName) {
      exchangeIds
      exchanges {
        symbol
        name
      }
    }
  }
`
