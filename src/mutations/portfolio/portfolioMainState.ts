import gql from 'graphql-tag'

export const portfolioMainState = gql`
  query portfolioMain {
    portfolioMain @client {
      activeChart
    }
  }
`
