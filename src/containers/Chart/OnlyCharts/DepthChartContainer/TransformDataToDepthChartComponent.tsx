import React, { Component } from 'react'
import DepthChart from '@containers/Chart/DepthChart/DepthChart'

class TransformDataToDepthChartComponent extends Component {
  state = {
    asks: [],
    bids: [],
  }
  static getDerivedStateFromProps(newProps) {
    const bids = newProps.data.marketOrders
      .map((o) => JSON.parse(o))
      .filter((o) => o.type === 'bid')
    const asks = newProps.data.marketOrders
      .map((o) => JSON.parse(o))
      .filter((o) => o.type === 'ask')

    return { asks, bids }
  }
  render() {
    const { asks, bids } = this.state
    console.log(this.state)
    return <DepthChart {...{ asks, bids, ...this.props }} />
  }
}

export default TransformDataToDepthChartComponent
