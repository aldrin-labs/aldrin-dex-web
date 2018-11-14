import gql from 'graphql-tag'

export const TOGGLE_BASE_COIN = gql`
  mutation toggleBaseCoin {
    toggleBaseCoin @client
  }
`
