import * as React from 'react'
// import styled from 'styled-components's
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  MarkSeries,
  // VerticalGridLines,
  // HorizontalGridLines,
  LineSeries,
  Crosshair,
} from 'react-vis'
import { format } from 'date-fns'

export interface Props {
  data: { x: number; y: number; label: string }[][]
}

export interface State {
  crosshairValues: { x: number; y: number; label: string }[]
}

export default class LineChart extends React.Component<Props, State> {
  state = {
    crosshairValues: [],
  }

  onNearestX = (_: any, v: { index: number }) => {
    const { data } = this.props
    if (!data) return

    this.setState({
      crosshairValues: data.map((d) => {
        return d[v.index]
      }),
    })
  }

  onMouseLeave = () => {
    this.setState({ crosshairValues: [] })
  }

  render() {
    const { data } = this.props

    const { crosshairValues } = this.state

    const axisStyle = {
      ticks: {
        padding: '1rem',
        stroke: '#fff',
        opacity: 0.5,
        fontFamily: 'Roboto',
        fontSize: '12px',
        fontWeight: 100,
      },
    }

    return (
      <FlexibleXYPlot margin={{ left: 70 }} onMouseLeave={this.onMouseLeave}>
        {/* <VerticalGridLines />
        <HorizontalGridLines style={{ stroke: 'rgba(134, 134, 134, 0.5)' }} /> */}
        <XAxis
          title="June 2018"
          style={axisStyle}
          hideLine
          // position="start"
          tickFormat={(v: number) => `${v}`}
          tickValues={data[0].map((d) => d.x)}
        />

        <YAxis
          title="USD"
          style={axisStyle}
          hideLine
          // tickFormat={(v) => `${v}М`}
        />
        {data.map((d, i) => (
          <LineSeries
            animation
            // style={{
            //   // stroke: 'rgba(133, 237, 238, 0.35)',
            //   strokeWidth: '3px',
            // }}
            key={i}
            data={
              d || [
                { x: 1, y: 3 },
                { x: 2, y: 5 },
                { x: 3, y: 15 },
                { x: 4, y: 12 },
              ]
            }
            onNearestX={this.onNearestX}
          />
        ))}

        {crosshairValues && <MarkSeries data={crosshairValues} animation />}

        {crosshairValues && (
          <Crosshair values={crosshairValues}>
            <div
              style={{
                minWidth: '250px',
                background: '#4c5055',
                color: '#4ed8da',
                padding: '5px',
                margin: '5px',
                fontSize: '1rem',
              }}
            >
              <p style={{ margin: 0, padding: 0 }}>
                {crosshairValues &&
                  crosshairValues[0] &&
                  format(
                    new Date(2018, 5, crosshairValues[0].x),
                    'dddd, MMM DD YYYY'
                  )}
              </p>
              {crosshairValues.map((v) => (
                <div key={v.label}>
                  <b>{v.label}</b>
                </div>
              ))}
            </div>
          </Crosshair>
        )}
      </FlexibleXYPlot>
    )
  }
}
