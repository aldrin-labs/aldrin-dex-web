import * as React from 'react'
import { compose, Query } from 'react-apollo'

import PortfolioChart from '@components/GQLChart/PortfolioChart/PortfolioChart'
import QueryRenderer from '@components/QueryRenderer'
import { GET_COINS } from '../../mutations/portfolio/getCoins'
import withTheme from '@material-ui/core/styles/withTheme'

import { PRICE_HISTORY_QUERY } from '@containers/Portfolio/api'
import { withErrorFallback } from '@hoc/index'
import { isEqual } from 'lodash-es'

const periods = {
  1: 60,
  7: 3600,
  30: 3600,
  90: 3600,
  365: 86400,
}

class GQLChart extends React.Component {
  state = {
    coins: [],
    assets: [],
    period: 3600,
    sum: 0,
    unixTimestampFrom: this.getTimestampRange(365).left,
    unixTimestampTo: this.getTimestampRange(365).right,
    days: 365,
    activeChart: '1Y',
    lastDrawLocation: null,
  }

  static getDerivedStateFromProps(newProps, state) {
    if (newProps.coins !== state.coins) {
      const newState = { ...state }
      // PAY ATTENTION: Object mutation here
      newState.coins = newProps.coins.filter(Boolean).map((x) => x.coin)
      newState.assets = newProps.coins.filter(Boolean)
      newState.sum = newProps.coins
        .filter(Boolean)
        .map((x) => x.quantity)
        .reduce((prev, next) => prev + next, 0)

      // newState.activeChart = newProps.localActiveChart;
      return newState
    }
    return null
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.activeChart !== this.props.activeChart ||
      !isEqual(
        nextProps.coins.filter(Boolean).map((row) => row.coin),
        this.props.coins.filter(Boolean).map((row) => row.coin)
      )
    )
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

  setActiveChartAndUpdateDays(activeChart, days) {
    this.setState((prevState) => {
      const newState = { ...prevState }
      const area = this.getTimestampRange(days)
      newState.days = days
      newState.unixTimestampFrom = area.left
      newState.unixTimestampTo = area.right
      newState.lastDrawLocation = null
      newState.activeChart = activeChart
      newState.period = periods[days]
      //      newState.period = periods[this.state.activeChart]
      return newState
    })
  }

  render() {
    const variables = {
      coins: this.state.coins,
      isBTC: false,
      unixTimestampFrom: this.state.unixTimestampFrom,
      unixTimestampTo: this.state.unixTimestampTo,
      period: this.state.period,
    }
    return (
      <QueryRenderer
        component={PortfolioChart}
        query={PRICE_HISTORY_QUERY}
        variables={variables}
        withOutSpinner={true}
        onChangeDateRange={(area) => this.onChangeDateRange(area)}
        setActiveChartAndUpdateDays={(label, days) =>
          this.setActiveChartAndUpdateDays(label, days)
        }
        lastDrawLocation={this.state.lastDrawLocation}
        setActiveChart={(v) => this.setActiveChart(v)}
        activeChart={this.state.activeChart}
        {...this.props}
      />
    )
  }
}

const withCoins = (props: any) => (
  <Query query={GET_COINS}>
    {({ data: { portfolioMain = [] } }) => (
      <GQLChart {...props} coins={portfolioMain.coins} />
    )}
  </Query>
)

export default compose(
  withTheme(),
  withErrorFallback
)(withCoins)
