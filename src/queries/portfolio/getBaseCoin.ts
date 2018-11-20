import gql from 'graphql-tag'

export const GET_BASE_COIN = gql`
  query {
    portfolio @client {
      baseCoin
    }
  }
`
