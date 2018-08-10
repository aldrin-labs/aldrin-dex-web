import React, { Component } from 'react'

import TradeHistoryTable from './Table/TradeHistoryTable'
import { maximumItemsInArray } from '@utils/chartPageUtils'

let unsubscribe: Function | undefined

class TableContainer extends Component {
  state = {
    data: [],
  }

  static getDerivedStateFromProps(newProps, state) {
    console.log(newProps.data)

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

      return {
        data: maximumItemsInArray([ticker, ...state.data], 100, 40),
      }
    }

    return null
  }

  componentDidMount() {
    if (this.props.subscribeToMore) {
      //  unsubscribe from old exchange when you first time change exchange
      unsubscribe && unsubscribe()

      unsubscribe = this.props.subscribeToMore()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.activeExchange.index !== this.props.activeExchange.index ||
      prevProps.currencyPair !== this.props.currencyPair
    ) {
      // when change exchange delete all data and...
      this.setState({ data: [] })

      //  unsubscribe from old exchange
      unsubscribe && unsubscribe()

      //  subscribe to new exchange and create new unsub link
      unsubscribe = this.props.subscribeToMore()
    }
  }

  render() {
    const {
      data,
      exchange, //  useless functions that we wont pass to table
      fetchMore,
      refetch,
      startPolling,
      stopPolling,
      subscribeToMore,
      updateQuery,
      ...rest
    } = this.props

    return <TradeHistoryTable data={this.state.data} {...rest} />
  }
}

export default TableContainer
