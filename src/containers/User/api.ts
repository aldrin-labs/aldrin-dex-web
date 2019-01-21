import gql from 'graphql-tag'

import { KeyFragment, CryptoWalletFragment } from '@core/graphql/fragments'

export const getKeysQuery = gql`
  query getKeys {
    myPortfolios {
      keys {
        _id
        name
        exchange
        apiKey
        date
        status
        valid
        processing
        lastUpdate
      }
    }
  }
`

export const deleteExchangeKeyMutation = gql`
  mutation deleteExchangeKey($name: String!) {
    deleteExchangeKey(name: $name)
  }
`

export const addExchangeKeyMutation = gql`
  mutation addExchangeKey(
    $name: String!
    $apiKey: String!
    $secret: String!
    $exchange: String!
    $date: Date!
  ) {
    addExchangeKey(
      name: $name
      apiKey: $apiKey
      secret: $secret
      exchange: $exchange
      date: $date
    ) {
      name
      apiKey
      exchange
      date
      status
      valid
      processing
      lastUpdate
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
    myPortfolios {
      cryptoWallets {
        _id
        name
        address
        baseAsset
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
    $date: Date!
  ) {
    addCryptoWallet(
      name: $name
      assetName: $assetName
      address: $address
      date: $date
    ) {
      name
      baseAsset
      address
      date
    }
  }
`

export const deleteCryptoWalletMutation = gql`
  mutation deleteCryptoWallet($name: String!) {
    deleteCryptoWallet(name: $name)
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
