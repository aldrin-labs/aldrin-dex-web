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

import { Loading } from '@components/Loading/Loading'
import { abbrNum } from '@containers/Chart/DepthChart/depthChartUtil'
import { maximumItemsInArray } from '@utils/chartPageUtils'

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
    MAX_DOMAIN_PLOT: 0,
    crosshairValuesForSpread: [],
    crosshairValuesForOrder: [],
    nearestOrderXIndex: null,
    transformedAsksData: [],
    transformedBidsData: [],
    asks: [],
    bids: [],
  }

  static getDerivedStateFromProps(props, state) {
    console.log(props)
    if (
      props.data &&
      props.data.marketOrders &&
      props.data.marketOrders.length > 0
    ) {
      const orderData = props.data.marketOrders[0]
      let order = {
        price: Number(orderData.price).toFixed(8),
        size: Number(orderData.size).toFixed(8),
        side: orderData.side,
      }

      // removing  orders with 0 size
      if (+order.size === 0) {
        return
      }

      // TODO: next here we should increase or decrease size of existing orders, not just replace them
      if (order.side === 'bid') {
        const ind = state.bids.findIndex((i) => i.price === order.price)
        if (ind > -1) {
          if (order.size !== '0') {
            state.bids.splice(ind, 1, order)
          } else {
            state.bids.splice(ind, 1)
          }
          order = null
        }
      }
      if (order !== null && order.side === 'ask') {
        const ind = state.asks.findIndex((i) => i.price === order.price)
        if (ind > -1) {
          if (order.size !== '0') {
            state.asks.splice(ind, 1, order)
          } else {
            state.asks.splice(ind, 1)
          }
          order = null
        }
      }
      if (order !== null) {
        const bids =
          order.side === 'bid'
            ? [order, ...state.bids].sort(
                (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
              )
            : state.bids
        const asks =
          order.side === 'ask'
            ? [order, ...state.asks].sort(
                (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
              )
            : state.asks

        const transformedAsksData = maximumItemsInArray(
          [...asks],
          1000,
          10
        ).map((el) => ({
          x: el.price,
          y: el.size,
        }))
        const transformedBidsData = maximumItemsInArray(
          [...bids],
          1000,
          10
        ).map((el) => ({
          x: el.price,
          y: el.size,
        }))

        console.log(transformedAsksData)
        console.log(transformedBidsData)

        // const maximumYinDataSet =
        //   transformedBidsData &&
        //   maxBy(transformedBidsData, (el) => el.y) &&
        //   maxBy(transformedBidsData, (el) => el.y).y
        //     ? Math.max(
        //         maxBy(transformedBidsData, (el) => el.y).y,
        //         maxBy(transformedAsksData, (el) => el.y).y
        //       )
        //     : 0

        return {
          transformedBidsData,
          transformedAsksData,
          asks,
          bids,
          MAX_DOMAIN_PLOT: 300,
          // maximumYinDataSet < 50000 ? maximumYinDataSet / 2 : 50000,
        }
      }
    }

    return null
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
      crosshairValuesForOrder: this.state.transformedAsksData
        .map((d, i) => {
          if (index === this.state.transformedAsksData.length - 1) {
            return null
          }

          if (i === index) {
            return d
          }

          return null
        })
        .filter(Boolean),
      nearestOrderXIndex: index,
    })
  }

  onNearestSpreadX = (value, { index }) => {
    const { transformedAsksData, transformedBidsData } = this.state
    this.setState({
      crosshairValuesForSpread: transformedBidsData
        .map((d, i) => {
          if (
            index === transformedBidsData.length - 1 &&
            this.state.nearestOrderXIndex === transformedAsksData.length - 1 &&
            i === index
          ) {
            return d
          }

          if (index === transformedBidsData.length - 1) {
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
    this.setState({
      crosshairValuesForSpread: [],
      crosshairValuesForOrder: [],
    })
  }

  render() {
    let {
      crosshairValuesForSpread,
      crosshairValuesForOrder,
      transformedAsksData: ordersData,
      transformedBidsData: spreadData,
    } = this.state
    const { base, quote, animated } = this.props

    // hack for showing only one crosshair at once
    if (
      crosshairValuesForSpread.length >= 1 &&
      crosshairValuesForOrder.length >= 1
    ) {
      crosshairValuesForSpread = []
    }

    if (!ordersData || !spreadData) {
      return <Loading centerAligned />
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
          <XAxis
            tickFormat={(value) => abbrNum(+value.toFixed(2), 2)}
            style={axisStyle}
          />
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
          {/* <VerticalRectSeries
            animation="gentle"
            key="charst"
            data={[
              {
                x0:
                  ordersData.length > 1 &&
                  ordersData[ordersData.length - 1].x - 0.01,
                x: ordersData.length > 1 && ordersData[ordersData.length - 1].x,
                y: this.state.MAX_DOMAIN_PLOT / 2,
              },
            ]}
            color="rgba(91, 96, 102, 0.7)"
          /> */}
          <AreaSeries
            onNearestX={this.onNearestOrderX}
            style={{
              fill: 'rgba(27, 94, 32, 0.43)',
              stroke: 'rgba(76, 175, 80, 0.74)',
              strokeWidth: '3px',
            }}
            animation={animated}
            key="chart"
            data={spreadData}
            color="rgba(91, 96, 102, 0.7)"
          />
          <AreaSeries
            onNearestX={this.onNearestSpreadX}
            style={{
              fill: 'rgba(191, 54, 12, 0.3)',
              stroke: '#FF5722b0',
              strokeWidth: '3px',
            }}
            animation={animated}
            key="chardt"
            data={ordersData}
            color="rgba(91, 96, 102, 0.7)"
          />

          {/* <Crosshair values={crosshairValuesForSpread}>
            <CrosshairContent>
              {crosshairValuesForSpread.length >= 1 ? (
                <>
                  <h4>
                    {`${crosshairValuesForSpread[0].y.toFixed(2)} `}
                    {base || 'Fiat'}
                  </h4>
                  <Br light />
                  <CrosshairBottomWrapper>
                    <div>
                      Can be bought {crosshairValuesForSpread[0].x.toFixed(2)}{' '}
                      {quote || 'CC'}
                    </div>
                    <RotatedBr />
                    <div>
                      For a total of{' '}
                      {(
                        crosshairValuesForSpread[0].y *
                        crosshairValuesForSpread[0].x
                      ).toFixed(2)}{' '}
                      {base || 'Fiat'}
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
                  <h4>
                    {`${crosshairValuesForOrder[0].y.toFixed(2)} `}{' '}
                    {base || 'Fiat'}
                  </h4>
                  <Br light />
                  <CrosshairBottomWrapper>
                    <div>
                      Can be sold {crosshairValuesForOrder[0].x.toFixed(2)}{' '}
                      {quote || 'CC'}
                    </div>
                    <RotatedBr />
                    <div>
                      For a total of{' '}
                      {(
                        crosshairValuesForOrder[0].y *
                        crosshairValuesForOrder[0].x
                      ).toFixed(2)}{' '}
                      {base || 'Fiat'}
                    </div>
                  </CrosshairBottomWrapper>
                </>
              ) : (
                <CircularProgress color="primary" />
              )}
            </CrosshairContent>
          </Crosshair> */}
        </FlexibleXYPlot>
      </Container>
    )
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
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
