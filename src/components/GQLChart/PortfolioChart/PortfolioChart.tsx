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

import Highlight from '@components/GQLChart/PortfolioChart/Highlight/Highlight'
import { abbrNum } from '@containers/Chart/DepthChart/depthChartUtil'
import { Loading } from '@components/Loading'
import { Props, State } from '@components/GQLChart/annotations'
import {
  Chart,
  SProfileChart,
} from '@components/GQLChart/PortfolioChart/styles'
import CardHeader from '@components/CardHeader'

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
    activeChart: '1Y',
    crosshairValues: [],
    data: [],
  }

  static getDerivedStateFromProps(newProps, state) {
    return Object.assign(state, newProps)
  }

  onChangeActiveChart = (label) => {
    this.props.setActiveChartAndUpdateDays(label, mapLabelToDays[label])
  }

  _onNearestX = (value, { index }) => {
    this.setState({
      crosshairValues: [value],
    })
  }

  _onMouseLeave = () => {
    this.setState({ crosshairValues: [] })
  }

  _formatDate = (date) => {}

  _onBrushStart = (data) => {}

  _onBrushEnd = (area) => {
    this.props.onChangeDateRange(area)
  }

  render() {
    const {
      coin,
      style,
      height = '100%',
      marginTopHr,
      lastDrawLocation,
      days,
      data,
      crosshairValues,
      isShownMocks,
      activeChart,
      theme,
    } = this.state
    const { name = '', priceUSD = '' } = coin || {}


    if (!(data.length)) {
      return <Loading centerAligned={true} />
    }

    const axisStyle = {
      ticks: {
        padding: '1rem',
        stroke: '#3E3E4A',
        opacity: 0.75,
        fontWeight: 100,
      },
      text: {
        stroke: 'none',
        fill: '#777777',
        fontWeight: 600,
        opacity: 1,
        fontFamily: 'Roboto',
        fontSize: '14px',
      },
    }

    return (
      <SProfileChart style={{ ...style, height }}>
        <CardHeader
          title={'Portfolio Value | Coming Soon | In development'}
          action={
            <>
              {chartBtns.map((chartBtn) => (
                <Button
                  color="secondary"
                  size="small"
                  onClick={() => {
                    this.onChangeActiveChart(chartBtn)
                  }}
                  color="secondary"
                  variant={chartBtn !== activeChart ? 'text' : 'contained'}
                  key={chartBtn}
                  style={{ margin: '0 1rem' }}
                >
                  {chartBtn}
                </Button>
              ))}
            </>
          }
        />
        {/* minus cardHeader Height */}
        <Chart height={`calc(100% - 68px)`}>
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
              style={{ stroke: '#848484' }}
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
            {/* hiding Axis for a while */}
            {false && (
              <YAxis
                style={axisStyle}
                tickFormat={(value) => `$${abbrNum(+value.toFixed(2), 2)}`}
              />
            )}
            <GradientDefs>
              <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={theme.palette.secondary.main}
                  stopOpacity={0.3}
                />
                <stop
                  offset="60%"
                  stopColor={theme.palette.secondary.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </GradientDefs>
            <AreaSeries
              color={'url(#CoolGradient)'}
              onNearestX={this._onNearestX}
              data={data}
              style={{
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
              <Highlight onBrushEnd={this._onBrushEnd} />
            )}
          </FlexibleXYPlot>
        </Chart>
      </SProfileChart>
    )
  }
}
