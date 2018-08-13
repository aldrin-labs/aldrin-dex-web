import gql from 'graphql-tag'

export const getKeysQuery = gql`
  query getKeys {
    getProfile {
      keys {
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
    }
  }
`

export const deleteExchangeKeyMutation = gql`
  mutation deleteExchangeKey($name: String, $removeTrades: Boolean) {
    deleteExchangeKey(name: $name, removeTrades: $removeTrades)
  }
`

export const addExchangeKeyMutation = gql`
  mutation addExchangeKey(
    $name: String
    $apiKey: String
    $secret: String
    $exchange: String
    $date: Date
  ) {
    addExchangeKey(
      name: $name
      apiKey: $apiKey
      secret: $secret
      exchange: $exchange
      date: $date
    ) {
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
  }
`
export const getExchangesListQuery = gql`
  query getExchangesList($page: Int, $perPage: Int) {
    exchangePagination(page: $page, perPage: 50) {
      count
      items {
        _id
        name
        marketIds
        markets {
          name
          baseId
          quoteId
          exchangeIds
          price
        }
      }
    }
  }
`
export const getExchangesForKeysListQuery = gql`
  query getExchangesForKeysList {
    exchangePagination(perPage: 150) {
      count
      items {
        _id
        name
        symbol
      }
    }
  }
`

export const getCryptoWalletsQuery = gql`
  query getCryptoWallets {
    getProfile {
      cryptoWallets {
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
    }
  }
`

export const addCryptoWalletMutation = gql`
  mutation addCryptoWallet(
    $name: String!
    $assetName: String!
    $address: String!
  ) {
    addCryptoWallet(
      name: $name
      assetName: $assetName
      address: $address
    ) {
      _id
      name
      address
      ownerId
      owner {
        _id
        username
      }
      baseAsset {
        name
        symbol
      }
    }
  }
`

export const deleteCryptoWalletMutation = gql`
  mutation deleteCryptoWallet($assetName: String!, $address: String!) {
    deleteCryptoWallet(assetName: $assetName, address: $address)
  }
`

export const searchSupportedNetworksQuery = gql`
  query searchSupportedNetworks {
    searchSupportedNetworks(limit: 100, search: "et") {
      name
      symbol
    }
  }
`
