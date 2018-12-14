import gql from 'graphql-tag'

export const updateIndustries = gql`
  mutation updateIndustries($industries: [Industry]!) {
    updateIndustries(industries: $industries) @client
  }
`
