import gql from 'graphql-tag'

import { PortfolioFragment } from '@graphql/fragments'

export const getMyRebalanceQuery = gql`
query {
  getProfile {
    myRebalance {
      total
      assets {
        id
        _id
        percent
        amount
        diff
      }
    }
  }
}
`

export const getMyPortfolioQuery = gql`
query{
  getProfile{
    portfolio{
      ...PortfolioFragment
    }
  }
}
${PortfolioFragment}
`

export const getMyPortfolioData = gql`
query {
  getProfile {
    portfolio {
      ...PortfolioFragment
    }
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
${PortfolioFragment}
`


export const updateRebalanceMutation = gql`
  mutation($input: rebalanceInput) {
    updateRebalance(input: $input) {
      total
    }
  }
`
