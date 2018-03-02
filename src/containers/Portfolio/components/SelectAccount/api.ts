import gql from 'graphql-tag'

export const getKeys = gql`
  query getKeys {
    getProfile {
      portfolioId
      keys {
        name
        apiKey
        secret
        date
        exchange {
          name
          symbol
        }
      }
    }
  }
`
