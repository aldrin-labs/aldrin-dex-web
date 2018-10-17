import gql from 'graphql-tag'

export const KeyFragment = gql`
  fragment KeyFragment on Key {
      apiKey
      exchange {
        name
        symbol
      }
  }
`

export const CryptoWalletFragment = gql`
  fragment CryptoWalletFragment on CryptoWallet {
    _id
    name
    address
    baseAssetId
    baseAsset {
      _id
      symbol
      name
    }
  }
`

export const PortfolioFragment = gql`
  fragment PortfolioFragment on porfolio {
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
`
