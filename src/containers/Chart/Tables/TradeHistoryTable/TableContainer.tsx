import React, { Component } from 'react'
import Table from './Table/TradeHistoryTable'
import QueryRenderer from '@components/QueryRenderer'
import { MARKET_QUERY, MARKET_TICKERS } from '../../api'

class TableContainer extends Component {
  render() {
    const symbol = this.props.currencyPair ? this.props.currencyPair : ''
    const exchange =
      this.props.activeExchange && this.props.activeExchange.exchange
        ? this.props.activeExchange.exchange.symbol
        : ''

    return (
      <QueryRenderer
        component={Table}
        query={MARKET_QUERY}
        variables={{ symbol, exchange }}
        subscriptionArgs={{
          subscription: MARKET_TICKERS,
          variables: { symbol, exchange },
          updateQueryFunction: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev
            }
            const newTicker = subscriptionData.data.listenMarketTickers
            let obj = Object.assign({}, prev, {
              marketTickers: [newTicker],
            })

            return obj
          },
        }}
        {...this.props}
      />
    )
  }
}

export default TableContainer
