import React, { Component } from 'react'
import Table from './Table/OrderBookTable'
import { maximumItemsInArray } from '@utils/chartPageUtils'

let unsubscribe: Function | undefined

class OrderBookTableContainer extends Component {
  state = {
    asks: [],
    bids: [],
  }

  // transforming data
  static getDerivedStateFromProps(newProps, state) {
    if (newProps.data.marketOrders) {
      console.log(1)
      const orders = newProps.data.marketOrders.filter((x) => x.exchange)

      let asks = orders
        .filter((x) => x.type === 'ask')
        .sort((a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0))
      asks = asks.slice(asks.length - 30, asks.length)
      console.log(asks)
      console.log(orders)
      return {
        asks,
        bids: orders
          .filter((x) => x.type === 'bid')
          .sort((a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0))
          .slice(0, 30),
      }
    }

    if (
      newProps.data &&
      newProps.data.marketOrders &&
      newProps.data.marketOrders.length > 0
    ) {
      console.log(2)
      const orderData = newProps.data.marketOrders[0]
      let order = {
        price: Number(orderData.price).toFixed(8),
        size: Number(orderData.size).toFixed(8),
        side: orderData.side,
      }

      // TODO: next here we should increase or decrease size of existing orders, not just replace them
      if (order.side === 'bid') {
        console.log(3)
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
        console.log(4)
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
        console.log(5)
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

        return { asks, bids }
      }

      if (state.bids.length > 30) {
        state.bids.pop()
      }
      if (state.asks.length > 30) {
        state.asks.pop()
      }
      console.log('end')
      return {
        bids: maximumItemsInArray([...state.bids], 50, 10),
        asks: maximumItemsInArray([...state.asks], 50, 10),
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
      this.setState({ data: [] })

      //  unsubscribe from old exchange
      unsubscribe && unsubscribe()

      //  subscribe to new exchange and create new unsub link
      unsubscribe = this.props.subscribeToMore()
    }
  }
  render() {
    const { data, ...rest } = this.props
    const { bids, asks } = this.state
    console.log(this.props.data.marketOrders.map((order) => JSON.parse(order)))
    // console.log(bids)
    // console.log(asks)

    return (
      //   <div />
      <Table
        {...this.props}
        data={this.props.data.marketOrders.map((order) => JSON.parse(order))}
        {...rest}
      />
    )
  }
}

export default OrderBookTableContainer
