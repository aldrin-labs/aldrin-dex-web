import gql from 'graphql-tag'

export const GET_COINS = gql`
  query getCoins {
    portfolioMain @client {
      coins
    }
  }
`
