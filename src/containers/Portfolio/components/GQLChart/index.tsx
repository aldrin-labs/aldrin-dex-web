import * as React from 'react'

import PortfolioChart from '@containers/Portfolio/components/GQLChart/PortfolioChart/PortfolioChart'
import QueryRenderer from '@components/QueryRenderer'
import { PRICE_HISTORY_QUERY } from '@containers/Portfolio/api'

export default class GQLChart extends React.Component {
  state = {
    coins: [],
    assets: [],
    sum: 0,
    unixTimestampFrom: this.getTimestampRange(365).left,
    unixTimestampTo: this.getTimestampRange(365).right,
    days: 365,
    lastDrawLocation: null,
  }

  static getDerivedStateFromProps(newProps, state) {
    if (newProps.coins !== state.coins) {
      const newState = { ...state }
      // tslint:disable-next-line:no-object-mutation
      newState.coins = newProps.coins.map((x) => x.coin)
      // tslint:disable-next-line:no-object-mutation
      newState.assets = newProps.coins
      // tslint:disable-next-line:no-object-mutation
      newState.sum = newProps.coins
        .map((x) => x.quantity)
        .reduce((prev, next) => prev + next, 0)
      console.log(newState)
      console.log(newProps)
      return newState
    }

    return null
  }

  getTimestampRange(days) {
    const today = Date.now() / 1000
    return {
      left: Math.floor(today - days * 24 * 60 * 60),
      right: Math.floor(today),
    }
  }

  updateDays(days) {
    this.setState((prevState) => {
      const newState = { ...prevState }
      const area = this.getTimestampRange(days)
      newState.days = days
      newState.unixTimestampFrom = area.left
      newState.unixTimestampTo = area.right
      newState.lastDrawLocation = null

      return newState
    })
  }

  onChangeDateRange(area) {
    if (area === null) {
      area = this.getTimestampRange(this.state.days)
    }
    this.setState((prevState) => {
      const newState = { ...prevState }
      newState.unixTimestampFrom = Math.floor(area.left)
      newState.unixTimestampTo = Math.floor(area.right)
      if (newState.lastDrawLocation === null) {
        newState.lastDrawLocation = area
      } else {
        newState.lastDrawLocation = prevState.lastDrawLocation
        newState.lastDrawLocation.left = newState.unixTimestampFrom
        newState.lastDrawLocation.right = newState.unixTimestampTo
      }
      return newState
    })
  }

  render() {
    return (
      <QueryRenderer
        component={PortfolioChart}
        query={PRICE_HISTORY_QUERY}
        variables={{
          coins: this.state.coins,
          isBTC: false,
          unixTimestampFrom: this.state.unixTimestampFrom,
          unixTimestampTo: this.state.unixTimestampTo,
        }}
        withOutSpinner={true}
        onChangeDateRange={(area) => this.onChangeDateRange(area)}
        updateDays={(days) => this.updateDays(days)}
        lastDrawLocation={this.state.lastDrawLocation}
        {...this.props}
      />
    )
  }
}
