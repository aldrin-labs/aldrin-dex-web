import gql from 'graphql-tag'

export const KeyFragment = gql`
  fragment KeyFragment on Key {
    _id
    name
    apiKey
    secret
    date
    exchangeId
    ownerId
    owner {
      _id
      username
    }
    exchange {
      name
      symbol
    }
  }
`

export const cryptoWalletFragment = gql`
  fragment cryptoWalletFragment on CryptoWallet {
    _id
    name
    address
    baseAssetId
    baseAsset {
      _id
      symbol
      name
    }
    ownerId
    owner {
      _id
      username
    }
  }
`
