import gql from 'graphql-tag'

export const gqlAddExchangeKey = gql`
  mutation addExchangeKey(
    $name: String
    $apiKey: String
    $secret: String
    $exchange: String
    $date: Date
  ) {
    addExchangeKey(name: $name, apiKey: $apiKey, secret: $secret, exchange: $exchange, date: $date) {
      name
      apiKey
      secret
      date
    }
  }
`
