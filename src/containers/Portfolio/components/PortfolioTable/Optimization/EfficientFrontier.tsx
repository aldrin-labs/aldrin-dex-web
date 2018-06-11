import React, { Component } from 'react'
import styled from 'styled-components'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineMarkSeries,
  MarkSeries,
  Hint,
} from 'react-vis'

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

class EfficientFrontier extends Component {
  state = {
    value: null,
  }

  onValueMouseOver = (value: { x: string; y: number }) =>
    this.setState({ value })

  onSeriesMouseOut = () => this.setState({ value: null })

  render() {
    const { percentages, risk, activeButton } = this.props.data
    const { value } = this.state

    let data = []
    let highlightedDotData = []

    if (percentages.length > 1) {
      data = percentages.map((percentage, i) => ({
        x: Number(risk[i]),
        y: Number(percentage),
      }))

      highlightedDotData.push(
        data.find((asset) => asset.y === percentages[activeButton])
      )
    }

    return (
      <Container>
        <FlexibleXYPlot>
          {data.length < 1 || highlightedDotData.length < 1 ? (
            <LineMarkSeries
              animation="gentle"
              curve={'curveNatural'}
              color="rgba(91, 96, 102, 0.7)"
              data={[{ x: 4, y: 1 }, { x: 3, y: 2 }, { x: 8, y: 5 }]}
            />
          ) : (
            [
              <XAxis style={axisStyle} key="x" title="Risk" />,
              <YAxis
                hideLine
                tickValues={[0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                tickFormat={(v: number) => `${v}`}
                style={axisStyle}
                key="y"
                title="Return"
              />,
              <LineMarkSeries
                key="c"
                curve={'curveNatural'}
                color="#4fd8da90"
                onSeriesMouseOut={this.onSeriesMouseOut}
                onValueMouseOver={this.onValueMouseOver}
                data={data}
              />,
              <MarkSeries
                onSeriesMouseOut={this.onSeriesMouseOut}
                onValueMouseOver={this.onValueMouseOver}
                key="h"
                color="#4fa1da"
                size={8}
                data={highlightedDotData}
              />,
              <HorizontalGridLines style={{ stroke: '#686c71' }} key="g" />,
            ]
          )}

          {value && (
            <Hint value={value}>
              <ChartTooltip>{`Risk ${value.x}% - Return ${
                value.y
              }%`}</ChartTooltip>
            </Hint>
          )}
        </FlexibleXYPlot>
      </Container>
    )
  }
}

const Container = styled.div`
  height: 300px;
  width: 100%;
`

const ChartTooltip = styled.span`
  font-family: Roboto;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #fff;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
  padding: 8px;
`

export default EfficientFrontier
