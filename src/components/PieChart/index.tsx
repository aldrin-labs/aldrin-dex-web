import * as React from 'react'
import styled from 'styled-components'
import { RadialChart, Hint, makeVisFlexible } from 'react-vis'

import { Props, State, PiePiece } from './PieChart.types'

const FlexibleRadialChart = makeVisFlexible(RadialChart);


export default class PieChart extends React.Component<Props, State> {
  state: State = {
    value: null,
  }

  render() {
    const { value } = this.state
    const { data, width, height, radius, innerRadius, flexible } = this.props
    const hasCustomColors = data.some((a) => !!a.color)

    const FLRadialChart = () => (
      <FlexibleRadialChart
        data={data}
        innerRadius={innerRadius || 0}
        colorType={hasCustomColors ? 'literal' : 'linear'}
        onValueMouseOver={(v: PiePiece) => this.setState({ value: v })}
        onSeriesMouseOut={() => this.setState({ value: null })}
      >
        {value && (
          <Hint value={value} orientation="topleft">
            <ChartTooltip>{value.label}</ChartTooltip>
          </Hint>
        )}
      </FlexibleRadialChart>
    )

    const NonFLRadialChart = () => (
      <RadialChart
        data={data}
        width={width || 200}
        height={height || 200}
        radius={radius || 200}
        innerRadius={innerRadius || 0}
        colorType={hasCustomColors ? 'literal' : 'linear'}
        onValueMouseOver={(v: PiePiece) => this.setState({ value: v })}
        onSeriesMouseOut={() => this.setState({ value: null })}
      >
        {value && (
          <Hint value={value} orientation="topleft">
            <ChartTooltip>{value.label}</ChartTooltip>
          </Hint>
        )}
      </RadialChart>
    )

    if (flexible) {
      return <FLRadialChart/>
    }

    return <NonFLRadialChart/>
  }
}

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
