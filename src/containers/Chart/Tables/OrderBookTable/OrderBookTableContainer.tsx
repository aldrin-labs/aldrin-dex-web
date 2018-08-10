import React, { Component } from 'react'

import { maximumItemsInArray, findSpread } from '@utils/chartPageUtils'
import OrderBookTable from './Tables/OrderBookTable'
import SpreadTable from './Tables/SpreadTable'

let unsubscribe: Function | undefined

const getNumberOfDigitsAfterDecimal = (
  orders: any[],
  column: 'size' | 'price'
) => {
  let numberOfDigitsAfterDecimal = 2
  for (const order of orders) {
    if (order[column] > 1) {
      numberOfDigitsAfterDecimal = 2
    } else {
      numberOfDigitsAfterDecimal = 8

      break
    }
  }

  return numberOfDigitsAfterDecimal
}
class OrderBookTableContainer extends Component {
  state = {
    asks: [],
    bids: [],
    spread: null,
    digitsAfterDecimalForAsksPrice: 0,
    digitsAfterDecimalForAsksSize: 0,
    i: 0,
  }

  // transforming data
  static getDerivedStateFromProps(newProps, state) {
    // when get data from querry
    let iterator = state.i
    if (newProps.data.marketOrders.length > 1) {
      const bids = newProps.data.marketOrders
        .map((o) => JSON.parse(o))
        .filter((o) => o.type === 'bid')
      const asks = newProps.data.marketOrders
        .map((o) => JSON.parse(o))
        .filter((o) => o.type === 'ask')

      newProps.setOrders({
        bids,
        asks,
      })

      const spread = findSpread(asks, bids)

      return {
        bids,
        asks,
        spread,
        i: 0,
        digitsAfterDecimalForAsksPrice: getNumberOfDigitsAfterDecimal(
          asks,
          'price'
        ),
        digitsAfterDecimalForAsksSize: getNumberOfDigitsAfterDecimal(
          asks,
          'size'
        ),
        digitsAfterDecimalForBidsPrice: getNumberOfDigitsAfterDecimal(
          bids,
          'price'
        ),
        digitsAfterDecimalForBidsSize: getNumberOfDigitsAfterDecimal(
          bids,
          'size'
        ),
      }
    }

    // when get data from subscr
    if (
      newProps.data &&
      newProps.data.marketOrders &&
      newProps.data.marketOrders.length > 0
    ) {
      const orderData = newProps.data.marketOrders[0]
      let order = {
        price: Number(orderData.price).toFixed(8),
        size: Number(orderData.size).toFixed(8),
        type: orderData.side,
      }

      // removing  orders with 0 size
      if (+order.size === 0) {
        return
      }

      // TODO: next here we should increase or decrease size of existing orders, not just replace them
      if (order.type === 'bid') {
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
      if (order !== null && order.type === 'ask') {
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
          order.type === 'bid'
            ? [order, ...state.bids].sort(
                (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
              )
            : state.bids
        const asks =
          order.type === 'ask'
            ? [order, ...state.asks].sort(
                (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
              )
            : state.asks

        // update depth chart every 100 iterations
        if (iterator === 100) {
          newProps.setOrders({
            bids,
            asks: asks.slice().reverse(),
          })
          iterator = 0
        } else {
          iterator += 1
        }

        const spread = findSpread(asks, bids)

        return {
          spread,
          bids: maximumItemsInArray([...bids], 60, 10),
          asks: maximumItemsInArray([...asks], 60, 10),
          i: iterator,
          digitsAfterDecimalForAsksPrice: getNumberOfDigitsAfterDecimal(
            asks,
            'price'
          ),
          digitsAfterDecimalForAsksSize: getNumberOfDigitsAfterDecimal(
            asks,
            'size'
          ),
          digitsAfterDecimalForBidsPrice: getNumberOfDigitsAfterDecimal(
            bids,
            'price'
          ),
          digitsAfterDecimalForBidsSize: getNumberOfDigitsAfterDecimal(
            bids,
            'size'
          ),
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
    const {
      bids,
      asks,
      spread,
      digitsAfterDecimalForAsksPrice,
      digitsAfterDecimalForAsksSize,
      digitsAfterDecimalForBidsPrice,
      digitsAfterDecimalForBidsSize,
    } = this.state

    return (
      <>
        <OrderBookTable
          digitsAfterDecimalForAsksSize={digitsAfterDecimalForAsksSize}
          digitsAfterDecimalForAsksPrice={digitsAfterDecimalForAsksPrice}
          data={asks}
          {...rest}
        />
        <SpreadTable
          digitsAfterDecimalForBidsSize={digitsAfterDecimalForBidsSize}
          digitsAfterDecimalForBidsPrice={digitsAfterDecimalForBidsPrice}
          data={bids}
          spread={spread}
          {...rest}
        />
      </>
    )
  }
}

export default OrderBookTableContainer
