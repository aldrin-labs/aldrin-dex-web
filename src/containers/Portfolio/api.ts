import gql from 'graphql-tag'

export const getPortfolio = gql`
  query gerPortfolio {
    getProfile {
      username
      portfolioId
  }
`
