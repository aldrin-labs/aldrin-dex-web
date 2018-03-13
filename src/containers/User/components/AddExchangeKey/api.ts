import gql from 'graphql-tag'

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
      name
      apiKey
      secret
      date
    }
  }
`

export const getExchangesListQuery = gql`
  query getExchangesList(
    $page: Int,
    $perPage: Int
  ) {
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
          exchangeId
          price
        }
      }
    }
  }
`
