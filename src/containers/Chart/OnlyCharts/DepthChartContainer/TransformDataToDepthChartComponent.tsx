import React, { Component } from 'react'
import DepthChart from '@containers/Chart/DepthChart/DepthChart'

class TransformDataToDepthChartComponent extends Component {
  state = {
    asks: [],
    bids: [],
  }

  static getDerivedStateFromProps(newProps) {
    let asks = [],
      bids = []

    if (newProps.data.marketOrders) {
      bids = newProps.data.marketOrders
        .map((o) => JSON.parse(o))
        .filter((o) => o.type === 'bid')
      asks = newProps.data.marketOrders
        .map((o) => JSON.parse(o))
        .filter((o) => o.type === 'ask')
    }

    return { asks, bids }
  }

  render() {
    const { asks, bids } = this.state

    return <DepthChart {...{ asks, bids, ...this.props }} />
  }
}

export default TransformDataToDepthChartComponent
