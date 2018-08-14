import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Paper, Slide, Grow } from '@material-ui/core'

import * as actions from '@containers/Chart/actions'
import WarningMessageSnack from '@components/WarningMessageSnack/WarningMessageSnack'
import Charts from '@containers/Chart/OnlyCharts/Charts/Charts'
import { opacityAnimation } from '../../../styles/keyframes'

class OnlyCharts extends Component<Props, {}> {
  onSelectChart = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target

    this.setState({ choosedChart: value })
  }

  render() {
    const {
      charts,
      removeChart,
      openedWarning,
      removeWarningMessage,
      theme,
    } = this.props

    return (
      <Slide direction="up" in={true} mountOnEnter={true} unmountOnExit={true}>
        <ChartContainer anime={false} chartsCount={charts.length}>
          {charts.map((chart: string, i: number) => (
            <Grow in={true} mountOnEnter={true} unmountOnExit={true}>
              <Wrapper key={chart}>
                <Charts
                  theme={theme}
                  removeChart={removeChart}
                  index={i}
                  chartsCount={charts.length}
                  currencyPair={chart}
                />
              </Wrapper>
            </Grow>
          ))}
          <WarningMessageSnack
            open={openedWarning}
            onCloseClick={removeWarningMessage}
            messageText={'You can create up to 8 charts.'}
          />
        </ChartContainer>
      </Slide>
    )
  }
}

const ChartContainer = styled.div`
  ${(props: { anime?: boolean }) =>
    props.anime
      ? `animation: ${opacityAnimation} 300ms cubic-bezier(0.4, 0, 1, 1) 0s 1 normal none running;`
      : ''};
  margin-top: ${(props: { chartsCount?: number }) => {
    if (props.chartsCount === 3 || props.chartsCount === 4) {
      return '10vh'
    }
    return 0
  }};
  overflow: hidden;
  max-height: calc(100vh - 59px - 80px);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(
    ${(props: { chartsCount?: number }) => {
      if (props.chartsCount && props.chartsCount <= 3) {
        return `${props.chartsCount}, ${100 / props.chartsCount}%`
      }
      return '4, 25%'
    }}
  );
  grid-template-rows: repeat(
    ${(props: { chartsCount?: number }) => {
      if (props.chartsCount && props.chartsCount > 4) {
        return '2, 41.5vh'
      }
      if (props.chartsCount === 3 || props.chartsCount === 4) {
        return '1, 60vh'
      }
      return '1, 80vh'
    }}
  );
`

const Wrapper = styled(Paper)`
  display: flex;
  flex-direction: column;
`
const mapStateToProps = (store: any) => ({
  charts: store.chart.charts,
  currencyPair: store.chart.currencyPair,
  isShownMocks: store.user.isShownMocks,
  openedWarning: store.chart.warningMessageOpened,
})

const mapDispatchToProps = (dispatch: any) => ({
  removeChart: (i: number) => dispatch(actions.removeChart(i)),
  removeWarningMessage: () => dispatch(actions.removeWarningMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(OnlyCharts)
