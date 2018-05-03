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
    exchangePagination(page: $page, perPage: $perPage) {
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
