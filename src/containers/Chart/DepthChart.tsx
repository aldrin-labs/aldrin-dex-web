import React, { Component } from 'react'
import styled from 'styled-components'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/lib/md'
import { maxBy } from 'lodash'
import {
  FlexibleXYPlot,
  VerticalRectSeries,
  XAxis,
  YAxis,
  AreaSeries,
  Crosshair,
} from 'react-vis'
import { CircularProgress, Divider } from '@material-ui/core'

import { abbrNum } from './depthChartUtil'

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
    // must be calculated
    MAX_DOMAIN_PLOT: 5000,
    crosshairValuesForSpread: [],
    crosshairValuesForOrder: [],
    // nearestOrderXIndex: null,
  }

  componentDidMount() {
    const { orderData, spreadData } = this.props

    if (!orderData || !spreadData) {
      return null
    }
    const maximumYinDataSet = Math.max(
      maxBy(spreadData, (el) => el.y).y,
      maxBy(orderData, (el) => el.y).y
    )
    this.setState({
      MAX_DOMAIN_PLOT:
        maximumYinDataSet < 50000 ? maximumYinDataSet / 2 : 50000,
    })
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
    this.setState({
      crosshairValuesForOrder: this.props.orderData
        .map((d, i) => {
          if (index === this.props.orderData.length - 1) {
            return null
          }

          if (i === index) {
            return d
          }

          return null
        })
        .filter(Boolean),
      //   nearestOrderXIndex: index,
    })
  }

  onNearestSpreadX = (value, { index }) => {
    const { orderData, spreadData } = this.props
    this.setState({
      crosshairValuesForSpread: spreadData
        .map((d, i) => {
          //   if (
          //     index !== spreadData.length - 1 &&
          //     this.state.nearestOrderXIndex === orderData.length - 1 &&
          //     i === index
          //   ) {
          //     return d
          //   }

          if (index === spreadData.length - 1) {
            return null
          }

          if (i === index) {
            return d
          }

          return null
        })
        .filter(Boolean),
    })
  }

  onMouseLeave = () => {
    this.setState({ crosshairValuesForSpread: [], crosshairValuesForOrder: [] })
  }

  render() {
    const { crosshairValuesForSpread, crosshairValuesForOrder } = this.state
    const { orderData, spreadData } = this.props

    if (!orderData || !spreadData) {
      return <CircularProgress color="primary" />
    }

    return (
      <Container>
        <FlexibleXYPlot
          margin={{ right: 48 }}
          onMouseLeave={this.onMouseLeave}
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
            tickFormat={(value) => abbrNum(+value.toFixed(2), 2)}
            key="afd"
            hideLine
            animation="stiff"
            orientation="right"
            style={axisStyle}
          />
          <YAxis
            tickFormat={(value) => abbrNum(+value.toFixed(2), 2)}
            key="dsafd"
            hideLine
            animation="stiff"
            style={axisStyle}
          />
          <VerticalRectSeries
            animation="gentle"
            key="charst"
            data={[
              {
                x0:
                  orderData.length > 1 &&
                  orderData[orderData.length - 1].x - 0.01,
                x: orderData.length > 1 && orderData[orderData.length - 1].x,
                y: this.state.MAX_DOMAIN_PLOT / 2,
              },
            ]}
            color="rgba(91, 96, 102, 0.7)"
          />
          <AreaSeries
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

          <Crosshair values={crosshairValuesForSpread}>
            <CrosshairContent>
              {crosshairValuesForSpread.length >= 1 ? (
                <>
                  <h4>{crosshairValuesForSpread[0].y.toFixed(2)} USD</h4>
                  <Br light />
                  <CrosshairBottomWrapper>
                    <div>
                      Can be bought {crosshairValuesForSpread[0].x.toFixed(2)}{' '}
                      BTC
                    </div>
                    <RotatedBr />
                    <div>
                      For a total of{' '}
                      {(
                        crosshairValuesForSpread[0].y *
                        crosshairValuesForSpread[0].x
                      ).toFixed(2)}
                      USD
                    </div>
                  </CrosshairBottomWrapper>
                </>
              ) : (
                <CircularProgress color="primary" />
              )}
            </CrosshairContent>
          </Crosshair>
          <Crosshair values={crosshairValuesForOrder}>
            <CrosshairContent>
              {crosshairValuesForOrder.length >= 1 ? (
                <>
                  <h4>{crosshairValuesForOrder[0].y.toFixed(2)} USD</h4>
                  <Br light />
                  <CrosshairBottomWrapper>
                    <div>
                      Can be sold {crosshairValuesForOrder[0].x.toFixed(2)} BTC
                    </div>
                    <RotatedBr />
                    <div>
                      For a total of{' '}
                      {(
                        crosshairValuesForOrder[0].y *
                        crosshairValuesForOrder[0].x
                      ).toFixed(2)}
                      USD
                    </div>
                  </CrosshairBottomWrapper>
                </>
              ) : (
                <CircularProgress color="primary" />
              )}
            </CrosshairContent>
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

const CrosshairContent = styled.div`
  background: rgba(37, 40, 44, 0.65);
  color: #9ca2aa;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  min-width: 15rem;
`

const Br = styled(Divider)`
  && {
    width: 10%;
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
  }
`

const RotatedBr = Br.extend`
  && {
    transform: rotate(90deg);
    margin-top: 1rem;
    margin-left: -1rem;
  }
`

const CrosshairBottomWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  color: gray;
  font-weight: 300;
  font-size: 0.75rem;
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
