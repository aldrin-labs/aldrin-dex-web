import React, { Component } from 'react'
import QueryRenderer from '@components/QueryRenderer'
import Table from './Table/OrderBookTable'
import {
  MARKET_QUERY,
  MARKET_ORDERS,
  updateTradeHistoryQuerryFunction,
} from '../../api'

class OrderBookTableContainer extends Component {
  render() {
    const { symbol, exchange } = this.props

    return (
      <QueryRenderer
        component={Table}
        query={MARKET_QUERY}
        variables={{ symbol, exchange }}
        subscriptionArgs={{
          subscription: MARKET_ORDERS,
          variables: { symbol, exchange },
          updateQueryFunction: updateTradeHistoryQuerryFunction,
        }}
        {...this.props}
      />
    )
  }
}

export default OrderBookTableContainer
