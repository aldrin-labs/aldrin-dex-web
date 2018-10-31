import * as React from 'react'
import styled from 'styled-components'
// import dateFormat from 'date-fns/format'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  MarkSeries,
  LineSeries,
  Crosshair,
  DiscreteColorLegend,
} from 'react-vis'

import { Props, State } from '@components/LineChart/LineChart.types'
import {
  inds,
  coins,
} from '@containers/Portfolio/components/PortfolioTable/Industry/mocks'
import { getColorsAndLabelsForChartLegend, colors } from './LineChart.utils'
import { LegendContainer } from '@styles/cssUtils'

const axisStyle = {
  ticks: {
    stroke: '#fff',
    opacity: 0.75,
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: 100,
  },
  text: { stroke: 'none', fill: '#4ed8da', fontWeight: 600, opacity: 1 },
}

export default class LineChart extends React.Component<Props, State> {
  state: State = {
    crosshairValues: [],
    deepLevel: 1,
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

  // onChangeData = () => {
  //   const { onChangeData } = this.props
  //   const { deepLevel } = this.state
  //
  //   this.setState({ deepLevel: deepLevel === 1 ? 2 : 1 }, () => {
  //     let data = inds
  //     if (deepLevel === 1) {
  //       data = inds
  //     } else if (deepLevel === 2) {
  //       data = coins
  //     }
  //
  //     if (onChangeData) onChangeData(data)
  //   })
  // }

  render() {
    const {
      data,
      activeLine,
      alwaysShowLegend,
      itemsForChartLegend,
    } = this.props
    const { crosshairValues } = this.state

    if (!data) return null

    // const format =
    //   crosshairValues &&
    //   crosshairValues[0] &&
    //   dateFormat(new Date(2018, 5, crosshairValues[0].x), 'dddd, MMM DD YYYY')

    const dateOptionsFormat = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const dateDataFormatted = crosshairValues && crosshairValues[0] && new Date(crosshairValues[0].x * 1000).toLocaleDateString('en-US', dateOptionsFormat)

    return (
      <FlexibleXYPlot onMouseLeave={this.onMouseLeave} margin={{left: 55, bottom: 55}} >
        {alwaysShowLegend && (
          <LegendContainer>
            <DiscreteColorLegend orientation="horizontal" items={itemsForChartLegend} />
          </LegendContainer>
        )}

        <XAxis
          // hideLine
          // title="June 2018"
          style={axisStyle}
          // tickFormat={(v: number) => `${v}`}
          // tickValues={data[0].map((d) => d.x)}
          tickFormat={(v: number) =>
            new Date(v * 1000).toUTCString().substring(5, 11)
          }
          tickLabelAngle={-90}
        />

        <YAxis
          // hideLine
          style={axisStyle}
          // tickFormat={(v: number) => `${v}`}
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
              // onSeriesClick={this.onChangeData}
            />
          )
        })}

        {crosshairValues && (
          <MarkSeries data={crosshairValues} animation color="#E0F2F1" />
        )}

        {crosshairValues && (
          <Crosshair values={crosshairValues}>
            <ContainerForCrossHairValues>
              <HeadingParagraph>{dateDataFormatted}</HeadingParagraph>

              {crosshairValues.map((v, i) => (
                <div key={`${v.label}: ${v.y} USD`}>
                  <Label style={{ color: colors[i] }}>{`${v.label}: ${
                    Number(v.y).toFixed(2)
                    }`}</Label>
                </div>
              ))}
            </ContainerForCrossHairValues>
          </Crosshair>
        )}
      </FlexibleXYPlot>
    )
  }
}

const ContainerForCrossHairValues = styled.div`
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  min-width: 250px;
  background-color: #393e44;
  color: #fff;
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
