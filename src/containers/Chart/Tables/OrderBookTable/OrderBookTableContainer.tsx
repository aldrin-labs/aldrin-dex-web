import React, { PureComponent } from 'react'

import { maximumItemsInArray } from '@utils/chartPageUtils'
import Table from './Tables/OrderBookTable'
import SpreadTable from './Tables/SpreadTable'

let unsubscribe: Function | undefined

class OrderBookTableContainer extends PureComponent {
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

      // TODO: next here we should increase or decrease size of existing orders, not just replace them
      if (order.side === 'bid') {
        const ind = state.bids.findIndex((i) => i.price === order.price)
        if (ind > -1) {
          if (order.size !== '0') {
            state.bids.splice(ind, 1, order)
          } else {
            state.bids.splice(ind, 1)
          }
          order = null
        }
      }
      if (order !== null && order.side === 'ask') {
        const ind = state.asks.findIndex((i) => i.price === order.price)
        if (ind > -1) {
          if (order.size !== '0') {
            state.asks.splice(ind, 1, order)
          } else {
            state.asks.splice(ind, 1)
          }
          order = null
        }
      }
      if (order !== null) {
        const bids =
          order.side === 'bid'
            ? [order, ...state.bids].sort(
                (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
              )
            : state.bids
        const asks =
          order.side === 'ask'
            ? [order, ...state.asks].sort(
                (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
              )
            : state.asks

        return {
          bids: maximumItemsInArray([...bids], 50, 10),
          asks: maximumItemsInArray([...asks], 50, 10),
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
    if (prevProps.activeExchange.index !== this.props.activeExchange.index) {
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
    // console.log(this.props.data.marketOrders)
    // console.log(bids)
    // console.log(asks)
    // testJSON()

    return (
      // <div />
      <>
        <Table data={bids} {...rest} />
        <SpreadTable data={asks} {...rest} />
      </>
    )
  }
}

export default OrderBookTableContainer
