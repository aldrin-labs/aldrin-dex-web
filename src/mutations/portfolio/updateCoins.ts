import gql from 'graphql-tag'

export const UPDATE_COINS = gql`
  mutation updateCoins($coins: [String!]!) {
    updateCoins(coins: $coins) @client
  }
`
