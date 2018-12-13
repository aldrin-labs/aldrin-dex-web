import gql from 'graphql-tag'

export const GET_OPTIMIZATION_COUNT_OF_RUNS = gql`
  query {
    portfolioOptimization @client {
      optimizationCountOfRuns
    }
  }
`
