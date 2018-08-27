import React, { Component } from 'react'
import { uniqBy } from 'lodash'

import {
  maximumItemsInArray,
  findSpread,
  getNumberOfDigitsAfterDecimal,
  sortAndFilterOrders,
  bidsPriceFiltering,
} from '@utils/chartPageUtils'
import OrderBookTable from './Tables/Asks/OrderBookTable'
import SpreadTable from './Tables/Bids/SpreadTable'

let unsubscribe: Function | undefined

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
      let bids = sortAndFilterOrders(
        newProps.data.marketOrders
          .map((o) => JSON.parse(o))
          .filter((o) => o.type === 'bid')
      )

      const asks = sortAndFilterOrders(
        newProps.data.marketOrders
          .map((o) => JSON.parse(o))
          .filter((o) => o.type === 'ask')
      )

      bids = bidsPriceFiltering(asks, bids)

      newProps.setOrders({
        bids,
        asks: asks.slice().reverse(),
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
      const order = {
        price: Number(Number(orderData.price).toFixed(8)),
        size: Number(Number(orderData.size).toFixed(8)),
        type: orderData.side,
      }

      let bids =
        order.type === 'bid'
          ? sortAndFilterOrders(uniqBy([order, ...state.bids], 'price'))
          : state.bids

      const asks =
        order.type === 'ask'
          ? sortAndFilterOrders(uniqBy([order, ...state.asks], 'price'))
          : state.asks
      bids = bidsPriceFiltering(asks, bids)

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
        bids: maximumItemsInArray([...bids], 1000, 11),
        asks: maximumItemsInArray([...asks], 1000, 11),
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
          data={asks.slice(asks.length - 50, asks.length)}
          {...rest}
        />
        <SpreadTable
          data={bids.slice(0, 50)}
          digitsAfterDecimalForBidsSize={digitsAfterDecimalForBidsSize}
          digitsAfterDecimalForBidsPrice={digitsAfterDecimalForBidsPrice}
          digitsAfterDecimalForSpread={Math.max(
            digitsAfterDecimalForBidsPrice,
            digitsAfterDecimalForAsksPrice
          )}
          spread={spread}
          {...rest}
        />
      </>
    )
  }
}

export default OrderBookTableContainer
