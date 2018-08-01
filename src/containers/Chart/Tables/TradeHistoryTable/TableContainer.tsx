import React, { Component } from 'react'
import Table from './Table/TradeHistoryTable'

class TableContainer extends Component {
  state = {
    data: [],
  }

  static getDerivedStateFromProps(newProps, state) {
    if (
      newProps.data &&
      newProps.data.marketTickers &&
      newProps.data.marketTickers.length > 0
    ) {
      const tickerData = JSON.parse(newProps.data.marketTickers[0])
      if (state.data.length > 0 && tickerData[3] === state.data[0].price) {
        return null
      }
      const fall =
        state.data.length > 0 ? state.data[0].price > tickerData[3] : false
      const ticker = {
        size: tickerData[4],
        price: tickerData[3],
        time: new Date(tickerData[7]).toLocaleTimeString(),
        fall,
      }

      return {
        data: [ticker, ...state.data],
      }
    }

    return null
  }

  render() {
    const { data, ...rest } = this.props

    return <Table data={this.state.data} {...rest} />
  }
}

export default TableContainer
