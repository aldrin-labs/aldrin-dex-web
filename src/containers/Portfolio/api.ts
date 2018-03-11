import gql from 'graphql-tag'

export const getPortfolio = gql`
  query getPortfolio {
    getProfile {
      username
    }
  }
`
