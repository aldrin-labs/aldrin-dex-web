import gql from 'graphql-tag'
// unused yet
export const ProfileQuery = gql`
  query ProfileQuery($id: MongoID!) {
    assetById(_id: $id) {
      _id
      name
      symbol
      nameTrue
      priceUSD
      maxSupply
      totalSupply
      availableSupply
      priceUSD
      percentChangeDay
    }
  }
`
