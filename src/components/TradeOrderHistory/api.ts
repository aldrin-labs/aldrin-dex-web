import gql from 'graphql-tag'

export const MyTradesQuery = gql`
  query MyTrades {
    myTrades {
      exchangeId
      exchange {
        name
      }
      amount
      cost
      datetime
      symbol
      side
    }
  }
`
