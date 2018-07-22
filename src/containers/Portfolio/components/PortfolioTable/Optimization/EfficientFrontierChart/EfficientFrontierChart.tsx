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

import {
  IState,
  IProps,
} from '@containers/Portfolio/components/PortfolioTable/Optimization/EfficientFrontierChart/EfficientFrontierChart.types'

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

class EfficientFrontierChart extends Component<IProps, IState> {
  state = {
    value: { x: null, y: null },
  }

  onValueMouseOver = (value: { x: string; y: string }) =>
    this.setState({ value })

  onSeriesMouseOut = () => this.setState({ value: { x: null, y: null } })

  render() {
    const { percentages, risk, activeButton } = this.props.data

    const { value } = this.state

    let data: { x: number; y: number }[] = []
    let highlightedDotData = []

    if (percentages.length > 1) {
      data = percentages.map((percentage, i) => ({
        x: +Number(risk[i]).toFixed(2),
        y: +Number(percentage).toFixed(2),
      }))

      highlightedDotData.push(
        data.find((asset) => asset.y === percentages[activeButton])
      )
    }

    return (
      <Container>
        <FlexibleXYPlot>
          {highlightedDotData.length < 1 ? (
            <LineMarkSeries
              animation="gentle"
              curve={'curveNatural'}
              color="rgba(91, 96, 102, 0.7)"
              data={[{ x: 4, y: 1 }, { x: 3, y: 2 }, { x: 8, y: 5 }]}
            />
          ) : (
            [
              <XAxis
                animation="gentle"
                style={axisStyle}
                key="x"
                title="Risk"
              />,
              <YAxis hideLine style={axisStyle} key="y" title="Return" />,
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
                animation="stiff"
                key="h"
                color="#4fa1da"
                size={8}
                data={highlightedDotData}
              />,
              <HorizontalGridLines style={{ stroke: '#686c71' }} key="g" />,
            ]
          )}

          {value.x === null || value.y === null ? null : (
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
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #fff;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #0006;
  padding: 8px;
`

export default EfficientFrontierChart
