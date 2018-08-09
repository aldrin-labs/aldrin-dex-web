import React, { Component } from 'react'

import {
  maximumItemsInArray,
  sortOrders,
  replaceOrdersWithSamePrice,
} from '@utils/chartPageUtils'
import Table from './Tables/OrderBookTable'
import SpreadTable from './Tables/SpreadTable'

let unsubscribe: Function | undefined

class OrderBookTableContainer extends Component {
  state = {
    asks: [],
    bids: [],
  }

  // transforming data
  static getDerivedStateFromProps(newProps, state) {
    if (
      newProps.data &&
      newProps.data.marketOrders &&
      newProps.data.marketOrders.length > 0
    ) {
      const orderData = newProps.data.marketOrders[0]
      let order = {
        price: Number(orderData.price).toFixed(8),
        size: Number(orderData.size).toFixed(8),
        side: orderData.side,
      }

      // removing  orders with 0 size
      if (+order.size === 0) {
        return
      }

      replaceOrdersWithSamePrice(state, order)

      if (order !== null) {
        const { asks, bids } = sortOrders(state, order)

        return {
          bids: maximumItemsInArray([...bids], 60, 10),
          asks: maximumItemsInArray([...asks], 60, 10),
        }
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
      this.setState({ asks: [], bids: [] })

      //  unsubscribe from old exchange
      unsubscribe && unsubscribe()

      //  subscribe to new exchange and create new unsub link
      unsubscribe = this.props.subscribeToMore()
    }
  }
  render() {
    const {
      data,
      //  useless functions
      fetchMore,
      refetch,
      startPolling,
      stopPolling,
      subscribeToMore,
      updateQuery,
      ...rest
    } = this.props
    const { bids, asks } = this.state

    return (
      <>
        <Table data={asks} {...rest} />
        <SpreadTable data={bids} {...rest} />
      </>
    )
  }
}

export default OrderBookTableContainer
