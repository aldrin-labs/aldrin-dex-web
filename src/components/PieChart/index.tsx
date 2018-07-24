import * as React from 'react'
import styled from 'styled-components'
import { RadialChart, Hint, makeVisFlexible } from 'react-vis'

import { Props, State, PiePiece } from '@components/PieChart/PieChart.types'

const FlexibleRadialChart = makeVisFlexible(RadialChart)

export default class PieChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
      value: null,
    }
  }

  onValueMouseOver = (value: PiePiece) => {
    const { data } = this.state
    if (this.state.value && this.state.value.label === value.label) return

    const index = data.findIndex((d) => d.label === value.label)
    const newData = data.slice().map((d) => ({ ...d, opacity: 0.5 }))
    newData.splice(index, 1, {
      ...data[index],
      opacity: 1,
      style: { stroke: '#fff', strokeWidth: '0.5px' },
    })

    this.setState({ value, data: newData })
  }

  onSeriesMouseOut = () => {
    this.setState({ value: null, data: this.props.data })
  }

  render() {
    const { value } = this.state
    const { data } = this.props

    const { width, height, radius, innerRadius, flexible, withHints } = this.props
    const hasCustomColors = data.some((a) => !!a.color || !!a.style)
    const colorIsNumber = data.every((a) => typeof a.color === 'number')

    const FLRadialChart = () => (
      <FlexibleRadialChart
        data={data}
        animation
        innerRadius={innerRadius || 0}
        colorType="linear"
        onValueMouseOver={this.onValueMouseOver}
        onSeriesMouseOut={this.onSeriesMouseOut}
      >
        {value && !!withHints && (
          <Hint value={value}>
            <ChartTooltip>{`${value.labelCurrency ? value.labelCurrency : ''} ${value.label} ${value.realValue}`}</ChartTooltip>
          </Hint>
        )}
        {value && !withHints && (
            <ChartTooltip>{`${value.label} ${value.realValue}`}</ChartTooltip>
        )}

      </FlexibleRadialChart>
    )

    const NonFLRadialChart = () => (
      <RadialChart
        data={data}
        animation
        width={width || 200}
        height={height || 200}
        radius={radius || 200}
        innerRadius={innerRadius || 0}
        colorType={hasCustomColors ? 'literal' : 'linear'}
        onValueMouseOver={(v: PiePiece) => this.setState({ value: v })}
        onSeriesMouseOut={() => this.setState({ value: null })}
      >

        {value && !!withHints && (
          <Hint value={value}>
            <ChartTooltip>{`${value.label} ${value.realValue}`}</ChartTooltip>
          </Hint>
        )}
        {value && !withHints && (
          <ChartTooltip>{`${value.label} ${value.realValue}`}</ChartTooltip>
        )}

      </RadialChart>
    )

    if (flexible) {
      return <FLRadialChart />
    }

    return <NonFLRadialChart />
  }
}

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
  width: 100px;
  height: 100px;
`
