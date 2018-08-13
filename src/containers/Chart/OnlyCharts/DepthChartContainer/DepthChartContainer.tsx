import React, { Component } from 'react'
import { connect } from 'react-redux'

import QueryRenderer from '@components/QueryRenderer'
import { ORDERS_MARKET_QUERY } from '@containers/Chart/api'
import TransformDataToDepthChartComponent from './TransformDataToDepthChartComponent'

class DepthChartContainer extends Component {
  render() {
    const { currencyPair, activeExchange, base, quote } = this.props
    const symbol = `${quote}_${base}` || ''
    const exchange =
      activeExchange && activeExchange.exchange
        ? activeExchange.exchange.symbol
        : ''

    return (
      <QueryRenderer
        component={TransformDataToDepthChartComponent}
        query={ORDERS_MARKET_QUERY}
        fetchPolicy="cache-and-network"
        variables={{ symbol, exchange }}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
  currencyPair: store.chart.currencyPair,
})

export default connect(mapStateToProps)(DepthChartContainer)
