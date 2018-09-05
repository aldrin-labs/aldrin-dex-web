import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Slide } from '@material-ui/core'

import * as actions from '@containers/Chart/actions'
import WarningMessageSnack from '@components/WarningMessageSnack/WarningMessageSnack'
import IndividualChart from '@containers/Chart/OnlyCharts/IndividualChart/IndividualChart'

class OnlyCharts extends Component<Props, {}> {
  componentDidMount() {
    const { charts, addChart, mainPair } = this.props
    if (charts.length === 0) {
      addChart(mainPair)
    }
  }
  render() {
    const {
      charts,
      removeChart,
      openedWarning,
      removeWarningMessage,
      theme,
      view,
    } = this.props

    return (
      <Slide
        direction="left"
        timeout={500}
        in={true}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <ChartContainer
          fullscreen={view !== 'default'}
          anime={false}
          chartsCount={charts.length || 1}
        >
          {charts.map(
            (chart: { pair: string; id: string } | string, i: number) =>
              // fallback for old values that were strings and now there must be objects
              typeof chart === 'string' ? (
                <IndividualChart
                  key={i}
                  theme={theme}
                  removeChart={removeChart}
                  index={i}
                  chartsCount={charts.length}
                  currencyPair={chart}
                />
              ) : (
                <IndividualChart
                  key={chart.id}
                  theme={theme}
                  removeChart={removeChart}
                  index={i}
                  chartsCount={charts.length}
                  currencyPair={chart.pair}
                />
              )
          )}
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
  margin-top: ${(props: { chartsCount?: number; fullscreen: boolean }) => {
    if (
      !props.fullscreen &&
      (props.chartsCount === 3 || props.chartsCount === 4)
    ) {
      return '10vh'
    }
    return 0
  }};
  overflow: hidden;
  max-height: ${(props) =>
    props.fullscreen ? '100vh' : 'calc(100vh - 59px - 80px)'};
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
    ${(props: { chartsCount?: number; fullscreen: boolean }) => {
      if (props.fullscreen) {
        if (props.chartsCount && props.chartsCount > 4) {
          return '2, calc(50vh - 30px)'
        }

        return '1, calc(100vh - 60px)'
      }
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

const mapStateToProps = (store: any) => ({
  charts: store.chart.charts,
  currencyPair: store.chart.currencyPair,
  isShownMocks: store.user.isShownMocks,
  openedWarning: store.chart.warningMessageOpened,
})

const mapDispatchToProps = (dispatch: any) => ({
  removeChart: (i: number) => dispatch(actions.removeChart(i)),
  addChart: (baseQuote: string) => dispatch(actions.addChart(baseQuote)),
  removeWarningMessage: () => dispatch(actions.removeWarningMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(OnlyCharts)
