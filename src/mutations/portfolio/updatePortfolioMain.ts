import gql from 'graphql-tag'

export const updatePortfolioMain = gql`
  mutation updatePortfolioMain($index: String!, $value: String!) {
    updatePortfolioMain(index: $index, value: $value) @client
  }
`
