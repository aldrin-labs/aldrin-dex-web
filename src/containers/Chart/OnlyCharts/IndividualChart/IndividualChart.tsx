import React, { Component } from 'react'
import { Button, Switch, Typography, Grow, Paper } from '@material-ui/core'
import { MdClear } from 'react-icons/lib/md'
import styled from 'styled-components'

import { SingleChart } from '@components/Chart'
import {
  IChartProps,
  IChartState,
} from '@containers/Chart/OnlyCharts/IndividualChart/IndividualChart.types'
import DepthChartContainer from '@containers/Chart/OnlyCharts/DepthChartContainer/DepthChartContainer'
import { CustomError } from '@components/ErrorFallback/ErrorFallback'
import { TypographyWithCustomColor } from '@styles/components'

export default class Charts extends Component<IChartProps, IChartState> {
  state: IChartState = {
    activeChart: 'candle',
    show: true,
  }

  render() {
    const { currencyPair, removeChart, index, theme } = this.props
    const { palette } = theme
    const { primary } = palette
    const { activeChart, show } = this.state

    if (currencyPair === undefined) {
      return <CustomError error="Clean local Storage!" />
    }

    const [base, quote] = currencyPair.split('_')
    const textColor = palette.getContrastText(primary.main)

    return (
      <Grow in={show} mountOnEnter={true} unmountOnExit={true}>
        <Wrapper>
          <ChartsSwitcher
            background={primary.main}
            divider={theme.palette.divider}
          >
            {' '}
            <StyledTypography textColor={textColor} variant="body1">
              {`${base}/${quote}`}
            </StyledTypography>
            <TypographyWithCustomColor textColor={textColor} variant="caption">
              Depth
            </TypographyWithCustomColor>
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
            <TypographyWithCustomColor textColor={textColor} variant="caption">
              Chart
            </TypographyWithCustomColor>
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
            <SingleChart additionalUrl={`/?symbol=${base}/${quote}`} />
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

const StyledTypography = styled(TypographyWithCustomColor)`
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
