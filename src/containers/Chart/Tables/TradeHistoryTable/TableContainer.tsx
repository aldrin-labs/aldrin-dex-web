import React, { Component } from 'react'

import Table from './Table/TradeHistoryTable'
import { maximumItemsInArray } from '@utils/chartPageUtils'

class TableContainer extends Component {
  state = {
    data: [],
  }

  static getDerivedStateFromProps(newProps, state) {
    if (
      !(
        newProps.data &&
        newProps.data.marketTickers &&
        newProps.data.marketTickers.length > 0 &&
        newProps.data.marketTickers.length !== state.data
      )
    ) {
      //  if data is actually not a new data
      return
    }
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

      console.log([ticker, ...state.data])

      return {
        data: maximumItemsInArray([ticker, ...state.data], 50, 10),
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
