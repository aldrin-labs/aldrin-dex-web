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

const ITEMS = [
  { title: 'Optimized', color: '#4fa1da' },
  { title: 'Original', color: '#4fd8da' },
]

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
class BarChart extends Component {
  state = {
    value: null,
  }

  onValueMouseOver = (value: { x: string; y: number }) =>
    this.setState({ value })

  onSeriesMouseOut = () => this.setState({ value: null })

  render() {
    const { data, optimizedData } = this.props.data
    const { value } = this.state

    const formatedData = data.map((el, i) => ({ x: el.coin, y: el.percentage }))
    const formatedOptimizedData = optimizedData.map((el, i) => ({
      x: el.coin,
      y: el.percentage,
    }))

    return (
      <div>
        <Container>
          <FlexibleXYPlot xType="ordinal">
            <LegendContainer value={value}>
              <DiscreteColorLegend orientation="horizontal" items={ITEMS} />
            </LegendContainer>
            {data.length < 1 || optimizedData.length < 1 ? (
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
                <VerticalBarSeries
                  style={{ cursor: 'pointer' }}
                  onSeriesMouseOut={this.onSeriesMouseOut}
                  onValueMouseOver={this.onValueMouseOver}
                  key="chart"
                  data={formatedData}
                  color="#4fd8da"
                  animation="gentle"
                />,
              ]
            )}

            {formatedOptimizedData.length > 0 && data.length > 0 ? (
              <VerticalBarSeries
                style={{ cursor: 'pointer' }}
                onSeriesMouseOut={this.onSeriesMouseOut}
                onValueMouseOver={this.onValueMouseOver}
                data={formatedOptimizedData}
                color="#4fa1da"
              />
            ) : null}
            {value && (
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
  opacity: ${(props) => (props.value ? '1' : '0')};
  border-radius: 5px;
  position: absolute;
  font-family: Roboto;
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

export default BarChart
