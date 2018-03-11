import gql from 'graphql-tag'
import getProfileQuery from './graphql/GetProfile.gql'


export const getPortfolio = gql`
  query gerPortfolio {
    getProfile {
      username
      portfolioId
      keyIds
      keys {
        name
        apiKey

      }
  }
`
