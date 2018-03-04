import gql from 'graphql-tag'


export const getKeysList = gql`
  query getKeysList {
    getProfile {
      keys {
        name
        apiKey
        secret
        data
        owner {
          username
          email
        }
        exchange {
          name
          symbol
        }
      }
    }
  }
`

export const deleteExchangeKey = gql`
  mutation deleteExchangeKey($name: String) {
    deleteExchangeKey(name: $name) {
      name
    }
  }
`
