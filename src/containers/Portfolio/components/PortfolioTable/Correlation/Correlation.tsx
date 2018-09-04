import * as React from 'react'
import { Subscription, Query } from 'react-apollo'
import styled from 'styled-components'
import { connect } from 'react-redux'

// import HeatMapChart from '@components/HeatMapChart'
import QueryRenderer from '@components/QueryRenderer'
import {
  // HeatMapMocks,
  CorrelationMatrixMockData,
} from '@containers/Portfolio/components/PortfolioTable/Correlation/mocks'
import CorrelationMatrix from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrix/CorrelationMatrix'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation.types'
import {
  toggleCorrelationTableFullscreen,
  setCorrelationPeriod,
} from '@containers/Portfolio/actions'
import {
  getCorrelationQuery,
  CORRELATION_UPDATE,
  getPortfolioQuery,
} from '@containers/Portfolio/api'
import {
  calcAllSumOfPortfolioAsset,
  percentagesOfCoinInPortfolio,
} from '@utils/PortfolioTableUtils'

class Correlation extends React.Component<IProps> {
  render() {
    const {
      children,
      isFullscreenEnabled,
      period,
      setCorrelationPeriodToStore,
      portfolio,
      filterValueSmallerThenPercentage,
      theme,
    } = this.props

    let dataRaw = {}
    let data = {} // filtered data by dust
    if (
      typeof this.props.data.correlationMatrixByDay === 'string' &&
      this.props.data.correlationMatrixByDay.length > 0
    ) {
      dataRaw = JSON.parse(this.props.data.correlationMatrixByDay)
    } else {
      dataRaw = this.props.data.correlationMatrixByDay
    }

    if (portfolio && dataRaw !== '') {
      // filter data here
      const allSums = calcAllSumOfPortfolioAsset(
        portfolio.getProfile.portfolio.assets,
        true
      )

      const listOfCoinsToFilter = portfolio.getProfile.portfolio.assets
        .filter(
          (d: any) =>
            percentagesOfCoinInPortfolio(d, allSums, true) <
            filterValueSmallerThenPercentage
        )
        .map((d: any) => d.asset.symbol)

      const listOfIndexes = listOfCoinsToFilter.map((coin) =>
        dataRaw.header.findIndex((d: any) => d === coin)
      )

      data = {
        header: dataRaw.header.filter((d, i) => !listOfIndexes.includes(i)),
        values: dataRaw.values
          .map((row: number[]) =>
            row.filter((d, i) => !listOfIndexes.includes(i))
          )
          .filter((d, i) => !listOfIndexes.includes(i)),
      }
    } else {
      data = dataRaw // no filter when mock on
    }

    return (
      <Subscription subscription={CORRELATION_UPDATE}>
        {(subscriptionData) => {
          console.log(data)
          console.log(portfolio)

          return (
            <PTWrapper background={theme.palette.background.paper}>
              {children}
              <CorrelationMatrix
                fullScreenChangeHandler={this.props.toggleFullscreen}
                isFullscreenEnabled={isFullscreenEnabled || false}
                data={
                  // has(subscriptionData, 'data') && subscriptionData.data
                  //   ? subscriptionData.data
                  //   : data
                  data
                }
                period={period}
                setCorrelationPeriod={setCorrelationPeriodToStore}
              />
            </PTWrapper>
          )
        }}
      </Subscription>
    )
  }
}

class CorrelationWrapper extends React.Component<IProps> {
  render() {
    const {
      isShownMocks,
      startDate,
      endDate,
      children,
      isFullscreenEnabled,
      toggleFullscreen,
      theme,
    } = this.props

    return (
      <Wrapper>
        {isShownMocks ? (
          <Correlation
            theme={theme}
            toggleFullscreen={toggleFullscreen}
            isFullscreenEnabled={isFullscreenEnabled}
            data={{ correlationMatrixByDay: CorrelationMatrixMockData }}
            children={children}
          />
        ) : (
          <Query query={getPortfolioQuery}>
            {({ loading, error, data }) => (
              <QueryRenderer
                component={Correlation}
                query={getCorrelationQuery}
                variables={{
                  startDate,
                  endDate,
                }}
                {...{ portfolio: data, ...this.props }}
              />
            )}
          </Query>
        )}
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  height: calc(100vh - 130px);
  width: calc(100% - 2rem);
  margin: 1.5rem;
  display: flex;
  flex-wrap: wrap;
`

const PTWrapper = styled.div`
  min-width: 70vw;
  width: 100%;
  min-height: 75vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props: { background: string }) => props.background};
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: auto;
`

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  isFullscreenEnabled: store.portfolio.correlationTableFullscreenEnabled,
  startDate: store.portfolio.correlationStartDate,
  endDate: store.portfolio.correlationEndDate,
  period: store.portfolio.correlationPeriod,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

const mapDispatchToProps = (dispatch: any) => ({
  toggleFullscreen: (data: any) => dispatch(toggleCorrelationTableFullscreen()),
  setCorrelationPeriodToStore: (payload: object) =>
    dispatch(setCorrelationPeriod(payload)),
})

const storeComponent = connect(mapStateToProps, mapDispatchToProps)(
  CorrelationWrapper
)

export default storeComponent
