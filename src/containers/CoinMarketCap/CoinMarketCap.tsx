import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { CoinsList } from './CoinsList'

const getCoinMarketCapQuery = gql`
{
	markets {
	  id
    rank
    symbol
    name
    price_usd
    market_cap_usd
    total_supply
    percent_change_24h
	}
}
`

class CoinMarketCap extends Component {

  componentWillReceiveProps(newProps) {
    if (!newProps.data.loading) {
      if (this.subscription) {
        if (newProps.data.markets !== this.props.data.markets) {
          // if the feed has changed, we need to unsubscribe before resubscribing
          this.subscription()
        } else {
          // we already have an active subscription with the right params
          return
        }
      }
      this.subscription = newProps
        .data
        .subscribeToMore({
          document: gql `
          subscription{
            listenMarket(marketSymbols: ["BTC"]){
              id
              rank
              symbol
              name
              price_usd
              market_cap_usd
              total_supply
              percent_change_24h
            }
        }
        `, variables: null,

          // this is where the magic happens.
          updateQuery: (previousState, {subscriptionData}) => ({
              markets: subscriptionData.data.listenMarket
            })
          ,
          onError: (err) => console.error(err)
        })
    }
  }


  render() {
    console.log(this.props.data);
    return <div>
      {
        this.props.data.loading ?
          <div />
        :
        <CoinsList data={this.props.data.markets} />
      }
    </div>
  }
}

export default graphql(getCoinMarketCapQuery, { options: {forceFetch: true }})(CoinMarketCap)
