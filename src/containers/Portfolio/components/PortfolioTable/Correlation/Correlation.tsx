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

    if (portfolio) {
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
            <PTWrapper>
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
    } = this.props

    return (
      <Wrapper>
        {isShownMocks ? (
          <Correlation
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
                  startDate: 1531441380,
                  endDate: 1531873380,
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

const PTWrapper = styled.div`
  min-width: 70vw;
  width: 100%;
  min-height: 75vh;
  display: flex;
  flex-direction: column;

  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: auto;
`

const Wrapper = styled.div`
  height: calc(100vh - 130px);
  width: calc(100% - 2rem);
  margin: 1.5rem;
  display: flex;
  flex-wrap: wrap;
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
