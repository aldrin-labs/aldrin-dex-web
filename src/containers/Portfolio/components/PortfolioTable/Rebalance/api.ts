import gql from 'graphql-tag'

export const getMyRebalanceQuery = gql`
query {
  getProfile {
  	myRebalance {
      total
      assets {
        percent
        amount
        diff
      }
    }
  }
}
`
