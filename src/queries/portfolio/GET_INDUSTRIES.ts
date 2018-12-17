import gql from 'graphql-tag'

export const GET_INDUSTRIES = gql`
  query GET_INDUSTRIES {
    portfolioIndustries @client {
      industries
    }
  }
`
