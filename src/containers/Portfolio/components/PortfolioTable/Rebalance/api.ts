import gql from 'graphql-tag'

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
      assetIds
      assets{
        quantity
        exchange {
          name
        }
        asset{
          symbol
          priceUSD
        }
      }
    }
  }
}
`

export const getMyPortfolioData = gql`
query {
  getProfile {
    portfolio {
      assetIds
      assets {
        exchange {
          name
        }
      	asset {
          name
          priceUSD
        }
      }
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
`


export const updateRebalanceMutation = gql`
  mutation($input: rebalanceInput) {
    updateRebalance(input: $input) {
      total
    }
  }
`
