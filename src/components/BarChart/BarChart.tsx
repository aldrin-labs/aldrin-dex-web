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

import {
  IProps,
  IState,
  Items,
  IValue,
  IChart,
} from '@components/BarChart/BarChart.types'

import { LegendContainer } from '@styles/cssUtils'

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
class BarChart extends Component<IProps, IState> {
  state = {
    value: { x: null, y: null },
  }

  onValueMouseOver = (value: IValue) => this.setState({ value })

  onSeriesMouseOut = () => this.setState({ value: { x: null, y: null } })

  render() {
    const {
      showPlaceholder,
      charts,
      height,
      alwaysShowLegend,
      hideDashForToolTip,
      animated = false,
      xAxisVertical,
    } = this.props
    const { value } = this.state

    const ITEMS: Items[] = []

    const Charts = charts.map((chart: IChart, chartIndex: number) => {
      const { color, title, data } = chart
      ITEMS.push({ title, color })

      return (
        <VerticalBarSeries
          style={{ cursor: 'pointer' }}
          onSeriesMouseOut={this.onSeriesMouseOut}
          onValueMouseOver={this.onValueMouseOver}
          key={chartIndex}
          data={data}
          color={color}
          animation={animated && 'wobbly'}
        />
      )
    })

    return (
      <div>
        <Container height={height}>
          <FlexibleXYPlot onMouseLeave={this.onSeriesMouseOut} xType="ordinal" margin={{ bottom: 55}}>
            {alwaysShowLegend && (
              <LegendContainer left={10}>
                <StyledDiscreteColorLegend orientation="horizontal" items={ITEMS} />
              </LegendContainer>
            )}
            {showPlaceholder ? (
              <VerticalBarSeries
                animation={animated && 'gentle'}
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
                <YAxis
                  animation={animated && 'gentle'}
                  style={axisStyle}
                  key="y"
                />,
                <XAxis
                  animation={animated && 'gentle'}
                  style={axisStyle}
                  key="x"
                  tickLabelAngle={xAxisVertical ? -90 : 0}
                />,
                ...Charts,
              ]
            )}

            {value.x === null || value.y === null ? null : (
              <Hint value={value}>
                <ChartTooltip>{`${value.x} ${hideDashForToolTip ? '' : '-'} ${value.y}%`}</ChartTooltip>
              </Hint>
            )}
          </FlexibleXYPlot>
        </Container>
      </div>
    )
  }
}

const Container = styled.div`
  height: ${(props: { height: number }) =>
    props.height ? `${props.height}px` : `100%`};
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
// it's a hotfix but we don't know why these items are height 0 and width 0 now.
// They should be not zero without this code
const StyledDiscreteColorLegend = styled(DiscreteColorLegend)`

  & .rv-discrete-color-legend-item__color {
    height: 3px;
    width: 30px;

  }
  
`

export default BarChart
