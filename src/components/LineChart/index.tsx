import * as React from 'react'
import styled from 'styled-components'
import {
  FlexibleWidthXYPlot,
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

    return (
      <FlexibleWidthXYPlot height={300} onMouseLeave={this.onMouseLeave}>
        <HorizontalGridLines />
        <XAxis
          title="X Axis"
          position="start"
          hideLine
          tickFormat={(v: number) => `${v + 16} Apr`}
          tickValues={[1, 2, 3, 4, 5, 6]}
        />
        <YAxis title="Y Axis" hideLine tickFormat={(v) => `${v} 000 000`} />
        {data.map((d) => (
          <LineSeries
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
      </FlexibleWidthXYPlot>
    )
  }
}
