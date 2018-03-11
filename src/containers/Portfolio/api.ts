import gql from 'graphql-tag'
import getProfileQuery from './graphql/GetProfile.gql'

export const getPortfolio = gql`
  query getPortfolio {
    getProfile {
      username
      _id
    }
  }
`
