import React, { Component } from 'react'

import { CoinsList } from './CoinsList'

export class CoinMarketCap extends Component {
  state = {
    loading: false,
    loaded: false,
    marketData: [],
  }

  async componentDidMount() {
    // TODO: move to HOC
    this.setState({
      loading: true,
    })
    const data = await fetch('https://api.coinmarketcap.com/v1/ticker/?limit=25')
    const json = await data.json()
    this.setState({
      loaded: true,
      loading: false,
    })
    this.setState({
      marketData: [...json],
    })
  }

  render() {
    const { marketData } = this.state
    return <CoinsList data={marketData} />
  }
}
