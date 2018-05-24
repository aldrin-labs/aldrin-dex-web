import * as React from 'react'
import styled from 'styled-components'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  Crosshair,
} from 'react-vis'

export default class LineChart extends React.Component {
  state = {
    crosshairValues: [],
  }

  onNearestX = (value, { index }) => {
    const { data } = this.props
    if (!data) return

    this.setState({
      crosshairValues: data.map((d) => {
        return d[index]
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
      <FlexibleXYPlot onMouseLeave={this.onMouseLeave}>
        <HorizontalGridLines style={{ stroke: 'rgba(134, 134, 134, 0.5)' }} />
        <XAxis
          style={axisStyle}
          position="start"
          hideLine
          tickFormat={(v: number) => `${v + 16}`}
          tickValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
        />
        <YAxis style={axisStyle} hideLine tickFormat={(v) => `${v}М`} />
        {data.map((d, i) => (
          <LineSeries
            style={{
              stroke: 'rgba(133, 237, 238, 0.35)',
              strokeWidth: '3px',
            }}
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

        <Crosshair values={crosshairValues}>
          <div
            style={{
              width: '100px',
              background: '#4c5055',
              color: '#4ed8da',
              padding: '5px',
              fontSize: '14px',
            }}
          >
            {crosshairValues.map((v) => (
              <React.Fragment>
                <b>{v.label}</b>
                <p>{v.y}</p>
              </React.Fragment>
            ))}
          </div>
        </Crosshair>
      </FlexibleXYPlot>
    )
  }
}
