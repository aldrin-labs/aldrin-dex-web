import React, { Component } from 'react'
import styled from 'styled-components'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/lib/md'
import { maxBy } from 'lodash'
import { connect } from 'react-redux'
import {
  FlexibleXYPlot,
  VerticalRectSeries,
  XAxis,
  YAxis,
  AreaSeries,
  Crosshair,
} from 'react-vis'
import {
  CircularProgress,
  Divider,
  Typography,
  IconButton,
} from '@material-ui/core'
import { red, green } from '@material-ui/core/colors'

import { Loading } from '@components/Loading/Loading'
import { abbrNum } from '@containers/Chart/DepthChart/depthChartUtil'
import { hexToRgbAWithOpacity } from '../../../styles/helpers'

class DepthChart extends Component {
  state = {
    // must be calculated
    MAX_DOMAIN_PLOT: 0,
    crosshairValuesForSpread: [],
    crosshairValuesForOrder: [],
    nearestOrderXIndex: null,
    transformedAsksData: [],
    transformedBidsData: [],
  }

  static getDerivedStateFromProps(props, state) {
    let totalVolumeAsks = 0
    const transformedAsksData = props.asks.map((el) => {
      totalVolumeAsks = totalVolumeAsks + el.size

      return {
        x: el.price,
        y: totalVolumeAsks,
      }
    })
    let totalVolumeBids = 0
    const transformedBidsData = props.bids.map((el) => {
      totalVolumeBids = totalVolumeBids + el.size

      return {
        x: el.price,
        y: totalVolumeBids,
      }
    })
    // console.log(transformedBidsData)
    // console.log(transformedAsksData)
    const maximumYinDataSet =
      transformedBidsData &&
      maxBy(transformedBidsData, (el) => el.y) &&
      maxBy(transformedBidsData, (el) => el.y).y
        ? Math.max(
            maxBy(transformedBidsData, (el) => el.y).y,
            maxBy(transformedAsksData, (el) => el.y).y
          )
        : 0

    return {
      transformedBidsData,
      transformedAsksData,
      MAX_DOMAIN_PLOT: maximumYinDataSet < 50000 ? maximumYinDataSet : 50000,
    }
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
          if (index === 0) {
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
    const { transformedBidsData } = this.state
    this.setState({
      crosshairValuesForSpread: transformedBidsData
        .map((d, i) => {
          if (
            index === 0 &&
            this.state.nearestOrderXIndex === 0 &&
            i === index
          ) {
            return d
          }

          if (index === 0) {
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
    const { base, quote, animated, asks, bids, theme } = this.props
    const { palette } = theme
    const axisStyle = {
      ticks: {
        padding: '1rem',
        stroke: theme.palette.text.primary,
        opacity: 0.5,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontFamily.fontSize,
        fontWeight: theme.typography.fontFamily.fontWeightLight,
      },
    }

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
          <MidPriceContainer
            background={hexToRgbAWithOpacity(palette.primary.light, 0.1)}
          >
            <IconButton onClick={() => this.scale('increase', 1.5)}>
              <MdRemoveCircleOutline />
            </IconButton>

            <MidPriceColumnWrapper>
              <Typography variant="subheading">
                {this.props.midMarketPrice || '6.224.352'}
              </Typography>
              <Typography variant="caption">Mid Market Price</Typography>
            </MidPriceColumnWrapper>

            <IconButton onClick={() => this.scale('decrease', 1.5)}>
              <MdAddCircleOutline />
            </IconButton>
          </MidPriceContainer>
          <XAxis
            tickTotal={10}
            tickFormat={(value) => abbrNum(+value.toFixed(4), 4)}
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
                  ordersData[ordersData.length - 1].x - 0.000001,
                x: ordersData.length > 1 && ordersData[ordersData.length - 1].x,
                y: this.state.MAX_DOMAIN_PLOT / 2,
              },
            ]}
            color="rgba(91, 96, 102, 0.7)"
          /> */}
          <AreaSeries
            curve={'curveStep'}
            onNearestX={this.onNearestOrderX}
            style={{
              fill: hexToRgbAWithOpacity(red['A100'], 0.25),
              stroke: red[400],
              strokeWidth: '3px',
            }}
            animation={animated}
            key="chart"
            data={ordersData}
          />
          <AreaSeries
            curve={'curveStep'}
            onNearestX={this.onNearestSpreadX}
            style={{
              fill: hexToRgbAWithOpacity(green['A200'], 0.25),
              stroke: green[500],
              strokeWidth: '3px',
            }}
            animation={animated}
            key="chardt"
            data={spreadData}
          />

          <Crosshair values={crosshairValuesForSpread}>
            <CrosshairContent
              background={palette.primary.main}
              textColor={palette.text.primary}
            >
              {crosshairValuesForSpread.length >= 1 ? (
                <>
                  <Typography variant="title" color="secondary">
                    {`${crosshairValuesForSpread[0].y.toFixed(2)} `}
                    {base || 'Fiat'}
                  </Typography>
                  <Br light={true} />
                  <CrosshairBottomWrapper>
                    <Typography variant="body1">
                      Can be bought {crosshairValuesForSpread[0].x.toFixed(8)}{' '}
                      {base || 'Fiat'}
                    </Typography>
                    <RotatedBr />
                    <Typography variant="body2">
                      For a total of{' '}
                      {(
                        crosshairValuesForSpread[0].y *
                        crosshairValuesForSpread[0].x
                      ).toFixed(8)}{' '}
                      {quote || 'CC'}
                    </Typography>
                  </CrosshairBottomWrapper>
                </>
              ) : (
                <CircularProgress color="primary" />
              )}
            </CrosshairContent>
          </Crosshair>
          <Crosshair values={crosshairValuesForOrder}>
            <CrosshairContent
              background={palette.primary.main}
              textColor={palette.text.primary}
            >
              {crosshairValuesForOrder.length >= 1 ? (
                <>
                  <Typography variant="title" color="secondary">
                    {`${crosshairValuesForOrder[0].y.toFixed(2)} `}{' '}
                    {base || 'Fiat'}
                  </Typography>

                  <Br light={true} />
                  <CrosshairBottomWrapper>
                    <Typography variant="body1">
                      Can be sold {crosshairValuesForOrder[0].x.toFixed(8)}{' '}
                      {base || 'Fiat'}
                    </Typography>
                    <RotatedBr />
                    <Typography variant="body2">
                      {' '}
                      For a total of{' '}
                      {(
                        crosshairValuesForOrder[0].y *
                        crosshairValuesForOrder[0].x
                      ).toFixed(8)}{' '}
                      {quote || 'CC'}
                    </Typography>
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
  position: relative;
`

const CrosshairContent = styled.div`
  background: ${(props: { background?: string; textColor?: string }) =>
    props.background};
  color: ${(props: { textColor?: string; background?: string }) =>
    props.textColor};
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
  background: ${(props: { background?: string }) => props.background};
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

const mapStateToProps = (store: any) => ({
  asks: store.chart.asks,
  bids: store.chart.bids,
})

export default connect(mapStateToProps)(DepthChart)
