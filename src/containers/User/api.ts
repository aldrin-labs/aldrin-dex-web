import gql from 'graphql-tag'

import { KeyFragment, cryptoWalletFragment } from '@graphql/fragments'

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
    myPortfolios {
      keys {
        _id
        name
        exchange
        apiKey
        date
      }
    }
  }
`

export const deleteExchangeKeyMutation = gql`
  mutation deleteExchangeKey($name: String) {
    deleteExchangeKey(name: $name)
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
      ...KeyFragment
    }
  }
  ${KeyFragment}
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
    myPortfolios {
      cryptoWallets {
        _id
        name
        address
        date
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
