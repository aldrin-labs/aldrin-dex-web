import React, { Component } from 'react'
import {
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  AreaSeries,
  FlexibleXYPlot,
  GradientDefs,
  Crosshair,
} from 'react-vis'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { yearData } from '../chartMocks'
import Highlight from '@containers/Portfolio/components/GQLChart/PortfolioChart/Highlight/Highlight'
import { abbrNum } from '@containers/Chart/DepthChart/depthChartUtil'
import {
  Props,
  State,
} from '@containers/Portfolio/components/GQLChart/annotations'
import {
  Chart,
  SProfileChart,
  BtnsContainer,
} from '@containers/Portfolio/components/GQLChart/PortfolioChart/styles'

const chartBtns = ['1D', '7D', '1M', '3M', '1Y']

const mapLabelToDays = {
  '1D': 1,
  '7D': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
}

export default class PortfolioChart extends Component<Props, State> {
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
      data,

      isShownMocks,
    } = this.props
    const { name = '', priceUSD = '' } = coin || {}
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

    if (transformedData.length === 0) {
      return (
        <Typography align="center" variant="display3" color="error">
          No data
        </Typography>
      )
    }

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

    return (
      <SProfileChart style={style}>
        <Chart height={height}>
          <FlexibleXYPlot
            margin={{ left: 50 }}
            animation={true}
            onMouseLeave={this._onMouseLeave}
            xDomain={
              lastDrawLocation && [
                lastDrawLocation.left,
                lastDrawLocation.right,
              ]
            }
          >
            <VerticalGridLines
              style={{ stroke: 'rgba(134, 134, 134, 0.2)' }}
              tickTotal={12}
              tickFormat={(v: number) => '`$${v}`'}
              tickValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
              labelValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
            />
            <HorizontalGridLines
              style={{ stroke: 'rgba(134, 134, 134, 0.2)' }}
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
            <GradientDefs>
              <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="40%" stopColor="#267871" stopOpacity={0.2} />
                <stop offset="80%" stopColor="#136a8a" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#136a8a" stopOpacity={0.5} />
              </linearGradient>
            </GradientDefs>
            <AreaSeries
              color={'url(#CoolGradient)'}
              onNearestX={this._onNearestX}
              data={transformedData}
              style={{
                // fill: 'rgba(133, 237, 238, 0.15)',
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
                    .join(' ')}
                  :{' '}
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

        <BtnsContainer>
          {chartBtns.map((chartBtn, i) => (
            <Button
              color="secondary"
              size="small"
              onClick={() => this.onChangeActiveChart(i)}
              style={
                i === this.props.activeChart
                  ? {
                      backgroundColor: '#4ed8da',
                      color: '#4c5055',
                      margin: '0 0.5rem',
                    }
                  : { margin: '0 0.5rem' }
              }
              key={chartBtn}
            >
              {chartBtn}
            </Button>
          ))}
        </BtnsContainer>
      </SProfileChart>
    )
  }
}
