import * as React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  MarkSeries,
  LineSeries,
  Crosshair,
  DiscreteColorLegend,
  LineMarkSeries,
} from 'react-vis'

import { Props, State } from '@components/LineChart/LineChart.types'
import { colors } from './LineChart.utils'
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
      additionalInfoInPopup,
    } = this.props

    const { crosshairValues } = this.state

    if (!data) {
      return (
        <FlexibleXYPlot>
          <LineMarkSeries
            curve={'curveCatmullRom'}
            color="rgba(91, 96, 102, 0.7)"
            data={[
              { x: 3, y: 2 },
              { x: 3, y: 2 },
              { x: 8, y: 5 },
              { x: 6, y: 7 },
            ]}
          />
        </FlexibleXYPlot>
      )
    }

    const dateOptionsFormat = {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const dateDataFormatted =
      crosshairValues &&
      crosshairValues[0] &&
      new Date(crosshairValues[0].x * 1000).toLocaleDateString(
        'en-US',
        dateOptionsFormat
      )

    return (
      <FlexibleXYPlot
        onMouseLeave={this.onMouseLeave}
        margin={{ left: 55, bottom: 55 }}
      >
        {alwaysShowLegend && (
          <LegendContainer>
            <StyledDiscreteColorLegend
              orientation="horizontal"
              items={itemsForChartLegend}
            />
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
              <Typography variant="subtitle1" style={{ marginBottom: '1rem'}}>{dateDataFormatted}</Typography>

              {crosshairValues.map((v, i) => (
                <div key={`${v.label}: ${v.y} USD`}>
                  <Typography variant="body2" style={{ color: colors[i] }}>{`${v.label}: ${Number(
                    v.y
                  ).toFixed(2)}`}</Typography>
                </div>
              ))}
              {additionalInfoInPopup && (
                <Typography variant="body2" style={{ marginTop: '1rem', fontStyle: 'italic'}}>Note: we simulate the starting balance of $1,000 for optimization</Typography>
              )}
            </ContainerForCrossHairValues>
          </Crosshair>
        )}
      </FlexibleXYPlot>
    )
  }
}

const ContainerForCrossHairValues = styled.div`
  min-width: 250px;
  background-color: #393e44;
  color: #fff;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 2px 6px 0 #0006;
`


// it's a hotfix but we don't know why these items are height 0 and width 0 now.
// They should be not zero without this code
const StyledDiscreteColorLegend = styled(DiscreteColorLegend)`

  & .rv-discrete-color-legend-item__color {
    height: 3px;
    width: 30px;

  }
  
`
