import * as React from 'react'
import styled from 'styled-components'
import { format as dateFormat } from 'date-fns'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  MarkSeries,
  LineSeries,
  Crosshair,
} from 'react-vis'

import { Props, State } from './LineChart.types'
import { colors } from '@containers/Portfolio/components/PortfolioTable/Industry/mocks'

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
    const { data, activeLine } = this.props
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

        <YAxis
          hideLine
          style={axisStyle}
          tickFormat={(v: number) => `$ ${v}`}
        />

        {data.map((serie, i) => {
          const color = activeLine === i ? '#fff' : colors[i]
          return (
            <LineSeries
              key={i}
              animation
              data={serie}
              color={color}
              onNearestX={this.onNearestX}
            />
          )
        })}

        {crosshairValues && (
          <MarkSeries data={crosshairValues} animation color="#E0F2F1" />
        )}

        {crosshairValues && (
          <Crosshair values={crosshairValues}>
            <Container>
              <HeadingParagraph>{format}</HeadingParagraph>

              {crosshairValues.map((v, i) => (
                <div key={`${v.label}: ${v.y} USD`}>
                  <Label style={{ color: colors[i] }}>{`${v.label}: ${
                    v.y
                  } USD`}</Label>
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
  background-color: #f5f5f5;
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
