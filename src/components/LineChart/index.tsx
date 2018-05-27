import * as React from 'react'
import styled from 'styled-components'
import { format as dateFormat } from 'date-fns'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  MarkSeries,
  AreaSeries,
  Crosshair,
  GradientDefs,
} from 'react-vis'

import { Props, State } from './LineChart.types'

export default class LineChart extends React.Component<Props, State> {
  state: State = {
    crosshairValues: [],
  }

  onNearestX = (_: any, v: { index: number }) => {
    const { data } = this.props
    if (!data) return

    this.setState({
      crosshairValues: data.map((serie) => {
        return serie[v.index]
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

    const format =
      crosshairValues &&
      crosshairValues[0] &&
      dateFormat(new Date(2018, 5, crosshairValues[0].x), 'dddd, MMM DD YYYY')

    return (
      <FlexibleXYPlot margin={{ left: 70 }} onMouseLeave={this.onMouseLeave}>
        <XAxis
          hideLine
          title="June 2018"
          style={axisStyle}
          tickFormat={(v: number) => `${v}`}
          tickValues={data[0].map((d) => d.x)}
        />

        <GradientDefs>
          <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#12939a" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#79c7e3" stopOpacity={0.3} />
          </linearGradient>
        </GradientDefs>

        <YAxis hideLine title="USD" style={axisStyle} />
        {data.map((serie, i) => (
          <AreaSeries
            key={i}
            animation
            data={serie}
            onNearestX={this.onNearestX}
            color={'url(#CoolGradient)'}
          />
        ))}

        {crosshairValues && (
          <MarkSeries data={crosshairValues} animation color="#fff" />
        )}

        {crosshairValues && (
          <Crosshair values={crosshairValues}>
            <Container>
              <HeadingParagraph>{format}</HeadingParagraph>

              {crosshairValues.map((v) => (
                <div key={v.label}>
                  <Label>{v.label}</Label>
                </div>
              ))}
            </Container>
          </Crosshair>
        )}
      </FlexibleXYPlot>
    )
  }
}

const Container = styled.div`
  min-width: 250px;
  background-color: #4c5055;
  color: #4ed8da;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 2px 6px 0 #0006;
`

const HeadingParagraph = styled.p`
  padding: 0;
  margin: 0 0 1rem 0;
`

const Label = styled.p`
  padding: 0;
  margin: 0;
`
