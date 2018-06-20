import React, { Component } from 'react'
import styled from 'styled-components'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/lib/md'
import {
  FlexibleXYPlot,
  VerticalRectSeries,
  XAxis,
  YAxis,
  AreaSeries,
  Crosshair,
} from 'react-vis'

const orderData = [
  { x: 1, y: 2500 },
  { x: 1.1, y: 2502 },
  { x: 1.2, y: 2503 },
  { x: 1.4, y: 2504 },
  { x: 1.5, y: 2505 },
  { x: 1.6, y: 2506 },
  { x: 1.7, y: 2507 },
  { x: 1.8, y: 2508 },
  { x: 1.85, y: 2505 },
  { x: 1.89, y: 2503 },
  { x: 1.91, y: 2504 },
  { x: 1.9, y: 2509 },
  { x: 3, y: 2000 },
  { x: 4, y: 1500 },
  { x: 6, y: 700 },
  { x: 10, y: 0 },
]
const spreadData = [
  { x: 20, y: 2500 },
  { x: 17, y: 2000 },
  { x: 14, y: 1500 },
  { x: 12, y: 700 },
  { x: 10, y: 0 },
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

class DepthChart extends Component {
  state = {
    MAX_DOMAIN_PLOT: 5000,
    crosshairValues: [],
    crosshairsValues: [],
  }

  scale = (type: 'increase' | 'decrease', scale: number) => {
    if (type === 'increase') {
      this.setState((prevState) => ({
        MAX_DOMAIN_PLOT: prevState.MAX_DOMAIN_PLOT * scale,
      }))
    }

    if (type === 'decrease') {
      this.setState((prevState) => ({
        MAX_DOMAIN_PLOT: prevState.MAX_DOMAIN_PLOT / scale,
      }))
    }
  }

  onNearestOrderX = (value, { index }) => {
    console.log(index + '0')

    this.setState({
      crosshairValues: orderData
        .map((d, i) => {
          if (i === index) {
            return d
          }

          return null
        })
        .filter(Boolean),
    })
  }

  onNearestSpreadX = (value, { index }) => {
    console.log(index + 'S')
    this.setState({
      crosshairsValues: spreadData
        .map((d, i) => {
          if (i === index) {
            return d
          }

          return null
        })
        .filter(Boolean),
    })
  }

  _onMouseLeave = () => {
    this.setState({ crosshairValues: [] })
  }

  render() {
    const { crosshairValues, crosshairsValues } = this.state

    return (
      <Container>
        <FlexibleXYPlot
          margin={{ right: 48 }}
          onMouseLeave={this._onMouseLeave}
          yDomain={[0, this.state.MAX_DOMAIN_PLOT]}
        >
          <MidPriceContainer>
            <Button onClick={() => this.scale('increase', 1.5)}>
              <MdRemoveCircleOutline />
            </Button>

            <MidPriceColumnWrapper>
              <div>{this.props.midMarketPrice || '6.224.352'}</div>
              <PriceTitle>Mid Market Price</PriceTitle>
            </MidPriceColumnWrapper>

            <Button onClick={() => this.scale('decrease', 1.5)}>
              <MdAddCircleOutline />
            </Button>
          </MidPriceContainer>
          <XAxis style={axisStyle} />
          <YAxis
            key="afd"
            hideLine
            animation="stiff"
            orientation="right"
            style={axisStyle}
          />
          <YAxis key="dsafd" hideLine animation="stiff" style={axisStyle} />
          <VerticalRectSeries
            animation="gentle"
            key="charst"
            data={[{ x0: 9.99999, x: 10, y: 25 / 2 }]}
            color="rgba(91, 96, 102, 0.7)"
          />
          <AreaSeries
            onSeriesMouseOver={() => {
              this.setState({ crosshairsValues: [] })
            }}
            onNearestX={this.onNearestOrderX}
            style={{
              fill: 'rgba(27, 94, 32, 0.43)',
              stroke: 'rgba(76, 175, 80, 0.74)',
              strokeWidth: '3px',
            }}
            animation="gentle"
            key="chart"
            data={orderData}
            color="rgba(91, 96, 102, 0.7)"
          />
          <AreaSeries
            onNearestX={this.onNearestSpreadX}
            style={{
              fill: 'rgba(191, 54, 12, 0.3)',
              stroke: '#FF5722b0',
              strokeWidth: '3px',
            }}
            animation="gentle"
            key="chardt"
            data={spreadData}
            color="rgba(91, 96, 102, 0.7)"
          />

          <Crosshair values={crosshairValues}>
            <div
              style={{
                background: '#4c50559e',
                color: '#4ed8da',
                padding: '5px',
                fontSize: '14px',
              }}
            >
              <p>
                {JSON.stringify(
                  crosshairValues.length >= 1 && crosshairValues[0].x
                )}
              </p>
            </div>
          </Crosshair>
          <Crosshair values={crosshairsValues}>
            <div
              style={{
                background: '#4c50559e',
                color: '#4ed8da',
                padding: '5px',
                fontSize: '14px',
              }}
            >
              <p>
                {JSON.stringify(
                  crosshairsValues.length >= 1 && crosshairValues[0]
                )}
              </p>
            </div>
          </Crosshair>
        </FlexibleXYPlot>
      </Container>
    )
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
`

const PriceTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 100;
  color: #c3c3c3b8;
`

const Button = styled.div`
  cursor: pointer;
  padding: 0.25rem;
`

const MidPriceContainer = styled.div`
  background: rgba(53, 61, 70, 0.3);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  position: absolute;
  top: 1rem;
  left: 35%;
`

const MidPriceColumnWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export default DepthChart
