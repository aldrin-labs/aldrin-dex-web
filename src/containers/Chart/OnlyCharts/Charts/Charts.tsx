import React, { Component } from 'react'
import { Button, Switch, Typography, Grow, Paper } from '@material-ui/core'
import { MdClear } from 'react-icons/lib/md'
import styled from 'styled-components'

import { SingleChart } from '@components/Chart'
import DepthChartContainer from '../DepthChartContainer/DepthChartContainer'
import { IChartProps, IChartState } from './Charts.types'

export default class Charts extends Component<IChartProps, IChartState> {
  state: IChartState = {
    activeChart: 'candle',
    show: true,
  }

  componentDidUpdate(prevProps) {
    // we need this hack to update depth chart Width when width of his container changes
    if (prevProps.chartsCount !== this.props.chartsCount) {
      const ordersDataContainer = this.state.ordersData
      this.setState({ ordersData: ordersDataContainer })
    }
  }

  render() {
    const { currencyPair, removeChart, index, theme } = this.props
    const {
      palette: { primary },
    } = theme
    const { activeChart, show } = this.state

    const [quote, base] = currencyPair.split('_')

    return (
      <Grow in={show} mountOnEnter={true} unmountOnExit={true}>
        <Wrapper>
          <ChartsSwitcher
            background={primary.main}
            divider={theme.palette.divider}
          >
            {' '}
            <StyledTypography color="default" variant="body1">
              {`${quote}/${base}`}
            </StyledTypography>
            <Typography color="default" variant="caption">
              Depth
            </Typography>
            <Switch
              color="default"
              checked={activeChart === 'candle'}
              onClick={() => {
                this.setState((prevState) => ({
                  activeChart:
                    prevState.activeChart === 'candle' ? 'depth' : 'candle',
                }))
              }}
            />
            <Typography color="default" variant="caption">
              Chart
            </Typography>
            <Button
              onClick={() => {
                this.setState({ show: false })
                setTimeout(() => {
                  removeChart(index)
                }, 200)
              }}
            >
              <MdClear />
            </Button>
          </ChartsSwitcher>
          {activeChart === 'candle' ? (
            <SingleChart additionalUrl={`/?symbol=${quote}/${base}`} />
          ) : (
            <DepthChartStyledWrapper>
              <DepthChartContainer
                {...{
                  base,
                  theme,
                  quote,
                  animated: false,
                }}
              />
            </DepthChartStyledWrapper>
          )}
        </Wrapper>
      </Grow>
    )
  }
}

const Wrapper = styled(Paper)`
  display: flex;
  flex-direction: column;
`

const StyledTypography = styled(Typography)`
  margin-right: auto;
  margin-left: 0.25rem;
`

const DepthChartStyledWrapper = styled.div`
  position: relative;
  height: calc(100% - 37px);
  width: 100%;
`

const ChartsSwitcher = styled.div`
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 38px;
  background: ${(props: { background?: string; divider?: string }) =>
    props.background};
  color: white;
  border-bottom: 1px solid
    ${(props: { divider?: string; background?: string }) => props.divider};
`
