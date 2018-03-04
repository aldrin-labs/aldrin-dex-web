import gql from 'graphql-tag'

export const gqlCreateUser = gql`
  mutation CreateUser(
    $idToken: String!
    $name: String!
    $emailAddress: String!
    $emailSubscription: Boolean!
  ) {
    createUser(
      idToken: $idToken
      name: $name
      emailAddress: $emailAddress
      emailSubscription: $emailSubscription
    ) {
      _id
    }
  }
`

export const gqlUserQuery = gql`
  query UserQuery {
    user {
      id
    }
  }
`
