import * as React from 'react'
import { compose, Query } from 'react-apollo'

import PortfolioChart from '@components/GQLChart/PortfolioChart/PortfolioChart'
import QueryRenderer from '@components/QueryRenderer'
import { GET_COINS } from '../../mutations/portfolio/getCoins'
import withTheme from '@material-ui/core/styles/withTheme'

import { PRICE_HISTORY_QUERY } from '@containers/Portfolio/api'
import { withErrorFallback } from '@hoc/index'
import { isEqual } from 'lodash-es'
import { yearData } from './chartMocks'

const periods = {
  1: 60,
  7: 3600,
  30: 3600,
  90: 3600,
  365: 86400,
}

const chartBtns: ReadonlyArray<any> = ['1D', '7D', '1M', '3M', '1Y']

const mapLabelToDays = {
  '1D': 1,
  '7D': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
}

const TransformData = (props: any) => {
  const { data, isShownMocks, ...otherProps } = props
  let transformedData = isShownMocks ? yearData : []
  if (
    data &&
    data.getPriceHistory &&
    data.getPriceHistory.prices &&
    data.getPriceHistory.prices.length > 0 &&
    !isShownMocks
  ) {
    const Yvalues = data.getPriceHistory.prices.map((x) => x)
    transformedData = data.getPriceHistory.dates.map((date, i) => ({
      x: Number(date),
      y: Yvalues[i],
    }))
  }

  return (
    <PortfolioChart
      data={ transformedData }
      { ...otherProps }
    />
  )
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
      const assets = Array.isArray(newProps.coins) ? newProps.coins : []
      // PAY ATTENTION: Object mutation here
      newState.coins = assets.filter(Boolean).map((x) => x.coin)
      newState.assets = assets.filter(Boolean)
      newState.sum = assets
        .filter(Boolean)
        .map((x) => x.quantity)
        .reduce((prev, next) => prev + next, 0)

      // newState.activeChart = newProps.localActiveChart;
      return newState
    }
    return null
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextAssets = Array.isArray(nextProps.coins) ? nextProps.coins : []
    const assets = Array.isArray(this.props.coins) ? nextProps.coins : []

    return (
      nextState.activeChart !== this.props.activeChart ||
      nextProps.tab !== this.props.tab ||
      !isEqual(
        nextAssets.filter(Boolean).map((row) => row.coin),
        assets.filter(Boolean).map((row) => row.coin)
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
      coins: this.state.coins.filter(Boolean),
      isBTC: false,
      unixTimestampFrom: this.state.unixTimestampFrom,
      unixTimestampTo: this.state.unixTimestampTo,
      period: this.state.period,
    }
    return (
      <QueryRenderer
        component={TransformData}
        tab={this.props.tab}
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
        chartBtns={chartBtns}
        mapLabelToDays={mapLabelToDays}
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
