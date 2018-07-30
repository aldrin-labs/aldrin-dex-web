import * as React from 'react'
import styled from 'styled-components'
import {
  XAxis,
  YAxis,
  VerticalGridLines,
  AreaSeries,
  FlexibleXYPlot,
  Crosshair,
} from 'react-vis'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import Highlight from './Highlight'
import { Props, State } from './annotations'
import { yearData } from './chartMocks'
import { Loading } from '@components/Loading/Loading'
import { ErrorFallback } from '@components/ErrorFallback'
import { abbrNum } from '../../../Chart/DepthChart/depthChartUtil'
const chartBtns = ['1D', '7D', '1M', '3M', '1Y']

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

const mapLabelToDays = {
  '1D': 1,
  '7D': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
}

class PortfolioChart extends React.Component<Props, State> {
  showSupplies: true
  state: State = {
    activeChart: 4,
    crosshairValues: [],
  }
  componentDidMount() {
    this.props.updateDays(mapLabelToDays[chartBtns[this.props.activeChart]])
  }

  onChangeActiveChart = (index: number) => {
    this.props.setActiveChart(index)
    this.props.updateDays(mapLabelToDays[chartBtns[index]])
  }

  _onNearestX = (value, { index }) => {
    //        console.log(value, index);
    this.setState({
      crosshairValues: [value],
    })
  }

  _onMouseLeave = () => {
    this.setState({ crosshairValues: [] })
  }

  _formatDate = (date) => {}

  render() {
    const { crosshairValues } = this.state
    const {
      coin,
      style,
      height,
      marginTopHr,
      lastDrawLocation,
      days,
      loading,
      error,
    } = this.props
    const { name = '', priceUSD = '' } = coin || {}

    const axisStyle = {
      ticks: {
        padding: '1rem',
        stroke: '#fff',
        opacity: 0.75,
        fontFamily: 'Roboto',
        fontSize: '12px',
        fontWeight: 100,
      },
      text: { stroke: 'none', fill: '#4ed8da', fontWeight: 600, opacity: 1 },
    }
    if (loading) {
      return <Loading centerAligned />
    } else if (error) {
      return <ErrorFallback error={error} />
    }

    return (
      <SProfileChart style={style}>
        <Chart
          style={{
            height,
          }}
        >
          <FlexibleXYPlot
            margin={{ left: 50 }}
            animation
            onMouseLeave={this._onMouseLeave}
            xDomain={
              lastDrawLocation && [
                lastDrawLocation.left,
                lastDrawLocation.right,
              ]
            }
          >
            <VerticalGridLines
              style={{ stroke: 'rgba(134, 134, 134, 0.5)' }}
              tickTotal={12}
              tickFormat={(v: number) => '`$${v}`'}
              tickValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
              labelValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
            />

            <XAxis
              style={axisStyle}
              tickFormat={(v: number) =>
                new Date(v * 1000).toUTCString().substring(5, 11)
              }
            />
            <YAxis
              style={axisStyle}
              tickFormat={(value) => `$${abbrNum(+value.toFixed(2), 2)}`}
            />
            <AreaSeries
              onNearestX={this._onNearestX}
              data={this.props.data}
              style={{
                fill: 'rgba(133, 237, 238, 0.15)',
                stroke: 'rgb(78, 216, 218)',
                strokeWidth: '1px',
              }}
            />

            <Crosshair values={crosshairValues}>
              <div
                style={{
                  background: '#4c5055',
                  color: '#4ed8da',
                  padding: '5px',
                  fontSize: '14px',
                }}
              >
                <p>
                  {crosshairValues
                    .map((v) => new Date(v.x * 1000).toDateString())
                    .join(' ')}:{' '}
                  {crosshairValues
                    .map((v) => `$${Number(v.y).toFixed(2)}`)
                    .join(' ')}
                </p>
              </div>
            </Crosshair>

            {this.props.isShownMocks ? null : (
              <Highlight
                onBrushEnd={(area) => {
                  this.props.onChangeDateRange(area)
                }}
              />
            )}
          </FlexibleXYPlot>
        </Chart>

        <Hr marginTopHr={marginTopHr} />

        <BtnsContainer>
          {chartBtns.map((chartBtn, i) => (
            <ChartBtn
              onClick={() => this.onChangeActiveChart(i)}
              style={
                i === this.props.activeChart
                  ? { backgroundColor: '#4ed8da', color: '#4c5055' }
                  : {}
              }
              key={chartBtn}
            >
              {chartBtn}
            </ChartBtn>
          ))}
        </BtnsContainer>
      </SProfileChart>
    )
  }
}

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
      <Query
        query={PRICE_HISTORY_QUERY}
        variables={{
          coins: this.state.coins,
          isBTC: false,
          unixTimestampFrom: this.state.unixTimestampFrom,
          unixTimestampTo: this.state.unixTimestampTo,
        }}
      >
        {({ subscribeToMore, loading, error, ...result }) => {
          let data = []
          if (
            result.data &&
            result.data.getPriceHistory &&
            result.data.getPriceHistory.prices &&
            result.data.getPriceHistory.prices.length > 0
          ) {
            const Yvalues = result.data.getPriceHistory.prices.map((x) => x)
            data = result.data.getPriceHistory.dates.map((date, i) => ({
              x: Number(date),
              y: Yvalues[i],
            }))
          }

          return (
            <PortfolioChart
              loading={loading}
              error={error}
              data={this.props.isShownMocks ? yearData : data}
              onChangeDateRange={(area) => this.onChangeDateRange(area)}
              updateDays={(days) => this.updateDays(days)}
              lastDrawLocation={this.state.lastDrawLocation}
              {...this.props}
            />
          )
        }}
      </Query>
    )
  }
}

const Chart = styled.div`
  width: 100%;
  min-height: 5em;
  margin-top: 24px;
`

const Hr = styled.hr`
  margin: ${(props: { marginTopHr: string }) =>
    props.marginTopHr
      ? `${props.marginTopHr} auto 0 auto;`
      : '45px auto 0 auto;'};
  width: 95%;
  height: 0.5px;
  border-radius: 1px;
  background-color: #ffffff;
`

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto 20px auto;
`

const ChartBtn = styled.button`
  border-radius: 2px;
  background-color: #4c5055;
  margin-right: 16px;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
`

const SProfileChart = styled.div`
  width: 100%;
  padding: 0 16px;
  border-radius: 3px;
  background-color: #393e44;
  min-height: 38vh;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`

const SuppliesBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 16px auto 0 auto;
`

const SupplyBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 56px;
  margin-right: 35px;
`

const CurrentRate = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 25px;
  font-weight: 500;
  color: #4ed8da;
`

const CommonRate = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  color: #ffffff;
`

const SupplyLowRate = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  color: #ff687a;
`

const SupplyHighRate = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  color: #65c000;
`

const SupplyDetail = styled.span`
  opacity: 0.5;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  color: #ffffff;
  margin-top: 4px;
`
