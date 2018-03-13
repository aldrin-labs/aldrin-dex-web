import gql from 'graphql-tag'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { CoinsList } from '@components'
import * as API from './api'

class CoinMarketCap extends Component {
  componentWillReceiveProps(newProps: any) {
    if (!newProps.data.loading) {
      if (this.subscription) {
        if (newProps.data.assetPagination.items !== this.props.data.assetPagination.items) {
          // if the feed has changed, we need to unsubscribe before resubscribing
          this.subscription()
        } else {
          // we already have an active subscription with the right params
          return
        }
      }
      this.subscription = newProps.data.subscribeToMore({
        document: gql`
          subscription {
            listenMarket(base: "USD") {
              pair
              pairId
              price
            }
          }
        `,
        variables: null,
        // this is where the magic happens.
        updateQuery: (previousState, { subscriptionData }) => {
          const newState = this.props.data.assetPagination.items.map(x => ({ ...x }))
          for (var i = 0; i < this.props.data.assetPagination.items.length; ++i) {
            if (newState[i].symbol === subscriptionData.data.listenMarket.pair.split('_')[0]) {
              console.log(
                newState[i].price_usd + ' === ' + subscriptionData.data.listenMarket.price
              )
              newState[i].price_usd = subscriptionData.data.listenMarket.price
              console.log('update')
              console.log(newState[i])
            }
          }
          const state = { items: {} }
          state.items = newState
          return state
        },
        onError: err => console.error(err),
      })
    }
  }

  render() {
    // console.log(55555, this.props.data)
    return (
      <div>
        {this.props.data.loading ? (
          <div />
        ) : (
          <CoinsList data={this.props.data.assetPagination.items} />
        )}
      </div>
    )
  }
}

export default graphql(API.getCoinMarketCapQuery, { options: { forceFetch: true } })(CoinMarketCap)
