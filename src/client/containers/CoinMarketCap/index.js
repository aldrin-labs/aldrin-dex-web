import React, { Component } from 'react'
import styled from 'styled-components'

import HomePage from 'components/pages/HomePage'

export default class CoinMarketCap extends Component {
  state = {
    loading: false,
    loaded: false,
    marketData: [],
  }

  componentDidMount() {
    console.log(123)
  }

  fetchMarketData = async () => {
    const data = await fetch('https://api.coinmarketcap.com/v1/ticker/')
    return await data.json()
  }

  render() {
    return (
      <HomePage>
        <div>zalupa</div>
      </HomePage>
    )
  }
}
