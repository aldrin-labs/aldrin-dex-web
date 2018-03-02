import React from 'react'
import gql from 'graphql-tag'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

const Testing = props => <div>{console.log(2222222, props)}</div>

const req = gql`
{
       exchangePagination {
      count
      items {
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

export const Test = compose(graphql(req))(Testing)
