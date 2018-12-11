import gql from 'graphql-tag'

export const UPDATE_OPTIMIZATION_COUNT_OF_RUNS = gql`
  mutation updateOptimizationCountOfRuns($count: Int!) {
    updateOptimizationCountOfRuns(count: $count) @client
  }
`
