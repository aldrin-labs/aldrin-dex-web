import * as React from 'react'
import gql from 'graphql-tag'

import PortfolioChart from '@containers/Portfolio/components/GQLChart/PortfolioChart/PortfolioChart'
import QueryRenderer from '@components/QueryRenderer'

export const PRICE_HISTORY_QUERY = gql`
  query priceHistoryQuery(
    $coins: [String!]
    $isBTC: Boolean!
    $unixTimestampFrom: Int!
    $unixTimestampTo: Int!
  ) {
    getPriceHistory(
      coins: $coins
      isBTC: $isBTC
      unixTimestampFrom: $unixTimestampFrom
      unixTimestampTo: $unixTimestampTo
      period: 3600
    ) {
      coins
      dates
      prices
    }
  }
`

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
      let newState = { ...state }
      // tslint:disable-next-line:no-object-mutation
      newState.coins = newProps.coins
        .map((x) => x.symbol)
        .filter((x) => x !== 'FUN')
      // tslint:disable-next-line:no-object-mutation
      newState.assets = newProps.coins
      // tslint:disable-next-line:no-object-mutation
      newState.sum = newProps.coins
        .map((x) => x.quantity)
        .reduce((prev, next) => prev + next, 0)

      return newState
    }

    return null
  }

  getTimestampRange(days) {
    const today = Date.now() / 1000 - 20 * 24 * 60 * 60
    return {
      left: Math.floor(today - days * 24 * 60 * 60),
      right: Math.floor(today),
    }
  }

  updateDays(days) {
    this.setState((prevState) => {
      let newState = { ...prevState }
      let area = this.getTimestampRange(days)
      newState.days = days
      newState.unixTimestampFrom = area.left
      newState.unixTimestampTo = area.right
      if (prevState.lastDrawLocation !== null) {
        area = prevState.lastDrawLocation
        area.left = newState.unixTimestampFrom
        area.right = newState.unixTimestampTo
        newState.lastDrawLocation = area
      }

      return newState
    })
  }

  onChangeDateRange(area) {
    if (area === null) {
      area = this.getTimestampRange(this.state.days)
    }

    this.setState((prevState) => {
      let newState = { ...prevState }
      newState.unixTimestampFrom = Math.floor(area.left)
      newState.unixTimestampTo = Math.floor(area.right)
      newState.lastDrawLocation = area
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
        onChangeDateRange={(area) => this.onChangeDateRange(area)}
        updateDays={(days) => this.updateDays(days)}
        lastDrawLocation={this.state.lastDrawLocation}
        {...this.props}
      />
    )
  }
}
