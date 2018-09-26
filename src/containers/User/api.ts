import gql from 'graphql-tag'

import { KeyFragment, cryptoWalletFragment } from '@graphql/fragments'

const KeyFragmentWithUser = gql`
  fragment KeyFragmentWithUser on Key {
    ...KeyFragment
    ownerId
    owner {
      _id
      username
    }
  }
  ${KeyFragment}
`

const cryptoWalletFragmentWithUser = gql`
  fragment cryptoWalletFragmentWithUser on CryptoWallet {
    ...cryptoWalletFragment
    ownerId
    owner {
      _id
      username
    }
  }
  ${cryptoWalletFragment}
`

export const getKeysQuery = gql`
  query getKeys {
    getProfile {
      keys {
        ...KeyFragmentWithUser
      }
    }
  }
  ${KeyFragmentWithUser}
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
      ...KeyFragmentWithUser
    }
  }
  ${KeyFragmentWithUser}
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
        ...cryptoWalletFragmentWithUser
      }
    }
  }
  ${cryptoWalletFragmentWithUser}
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
      ...cryptoWalletFragmentWithUser
    }
  }
  ${cryptoWalletFragmentWithUser}
`

export const deleteCryptoWalletMutation = gql`
  mutation deleteCryptoWallet($assetName: String!, $address: String!) {
    deleteCryptoWallet(assetName: $assetName, address: $address)
  }
`

export const searchSupportedNetworksQuery = gql`
  query searchSupportedNetworks {
    searchSupportedNetworks(limit: 200, search: "") {
      name
      symbol
    }
  }
`

export const searchAssetsQuery = gql`
  query searchAssets($search: String!) {
	  searchAssets(limit: 10, search: $search) {
      symbol
    }
  }
`

export const exchangeByEntryQuery = gql`
  query exchangeByEntry($search: String!) {
		exchangeByEntry(limit: 10, entry: $search) {
      name
    }
  }
`
