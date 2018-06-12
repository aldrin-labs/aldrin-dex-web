import React, { Component } from 'react'
import styled from 'styled-components'
import {
  FlexibleXYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  Hint,
  DiscreteColorLegend,
} from 'react-vis'

import { IProps, IState, Items, IValue, IChart } from './types'

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
class BarChart extends Component<IProps, IState> {
  state = {
    value: { x: null, y: null },
  }

  onValueMouseOver = (value: IValue) => this.setState({ value })

  onSeriesMouseOut = () => this.setState({ value: { x: null, y: null } })

  render() {
    const { showPlaceholder, charts } = this.props
    const { value } = this.state

    const ITEMS: Items[] = []

    const Charts = charts.map((chart: IChart, chartIndex: number) => {
      const { color, title, data } = chart
      ITEMS.push({ title, color })
      console.log(data)

      return (
        <VerticalBarSeries
          style={{ cursor: 'pointer' }}
          onSeriesMouseOut={this.onSeriesMouseOut}
          onValueMouseOver={this.onValueMouseOver}
          key={chartIndex}
          data={data}
          color={color}
          animation="gentle"
        />
      )
    })

    return (
      <div>
        <Container>
          <FlexibleXYPlot xType="ordinal">
            <LegendContainer value={value}>
              <DiscreteColorLegend orientation="horizontal" items={ITEMS} />
            </LegendContainer>
            {showPlaceholder ? (
              <VerticalBarSeries
                animation="gentle"
                key="chart"
                data={[
                  { x: 'Q1', y: 10 },
                  { x: 'Q2', y: 5 },
                  { x: 'Q3', y: 15 },
                  { x: 'Q4', y: 25 },
                  { x: 'Q5', y: 20 },
                ]}
                color="rgba(91, 96, 102, 0.7)"
              />
            ) : (
              [
                <YAxis style={axisStyle} key="y" />,
                <XAxis style={axisStyle} key="x" />,
                ...Charts,
              ]
            )}

            {value.x === null || value.y === null ? null : (
              <Hint value={value}>
                <ChartTooltip>{`${value.x} - ${value.y}%`}</ChartTooltip>
              </Hint>
            )}
          </FlexibleXYPlot>
        </Container>
      </div>
    )
  }
}

const LegendContainer = styled.div`
  opacity: ${(props: { value: IValue | { x: null; y: null } }) =>
    props.value.x === null || props.value.y === null ? '0' : '1'};
  border-radius: 5px;
  position: absolute;
  font-family: Roboto, sans-serif;
  background-color: #869eb180;
  top: 0px;
  left: 10%;
  color: white;
  transition: opacity 0.25s ease-out;
`

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

export default BarChart
