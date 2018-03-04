import gql from 'graphql-tag'

export const getProfile = gql`
  query getProfile {
    getProfile {
      username
      imageUrl
      email
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
