import * as React from 'react'
import { Subscription, Query } from 'react-apollo'
import { connect } from 'react-redux'
import styled from 'styled-components'

import QueryRenderer from '@components/QueryRenderer'
import { CorrelationMatrixMockData } from '@containers/Portfolio/components/PortfolioTable/Correlation/mocks'
import CorrelationMatrix from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrix/CorrelationMatrix'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation.types'
import {
  toggleCorrelationTableFullscreen,
  setCorrelationPeriod as setCorrelationPeriodAction,
} from '@containers/Portfolio/actions'
import {
  getCorrelationQuery,
  CORRELATION_UPDATE,
  getPortfolioMainQuery,
} from '@containers/Portfolio/api'
import {
  calcAllSumOfPortfolioAsset,
  percentagesOfCoinInPortfolio,
} from '@utils/PortfolioTableUtils'
import { Loading } from '@components/Loading'
import { PTWrapper as PTWrapperRaw } from '../Main/PortfolioTableBalances/PortfolioTableBalances.styles'

const Correlation = (props: IProps) => {
  const {
    children,
    isFullscreenEnabled,
    period,
    setCorrelationPeriodToStore,
    portfolio,
    filterValueSmallerThenPercentage,
  } = props

  let dataRaw = {}
  let data = {} // filtered data by dust
  if (
    props.data.myPortfolios &&
    props.data.myPortfolios.length > 0 &&
    typeof props.data.myPortfolios[0].correlationMatrixByDay === 'string' &&
    props.data.myPortfolios[0].correlationMatrixByDay.length > 0
  ) {
    dataRaw = JSON.parse(props.data.myPortfolios[0].correlationMatrixByDay)
  } else {
    dataRaw = props.data.myPortfolios[0].correlationMatrixByDay
  }

  if (portfolio && portfolio.getProfile && dataRaw !== '') {
    // filter data here
    const allSums = calcAllSumOfPortfolioAsset(
      portfolio.getProfile.portfolio.assets
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
        return (
          <>
            {children}
            <CorrelationMatrix
              fullScreenChangeHandler={props.toggleFullscreen}
              isFullscreenEnabled={isFullscreenEnabled || false}
              data={
                // has(subscriptionData, 'data') && subscriptionData.data
                //   ? subscriptionData.data
                //   : data
                data
              }
              setCorrelationPeriod={setCorrelationPeriodToStore}
              period={period}
            />
          </>
        )
      }}
    </Subscription>
  )
}

const CorrelationWrapper = (props: IProps) => {
  const { isShownMocks, startDate, endDate, baseCoin, children } = props

  return (
    <PTWrapper>
      {isShownMocks ? (
        <Correlation
          data={{ correlationMatrixByDay: CorrelationMatrixMockData }}
          children={children}
          {...props}
        />
      ) : (
          <Query query={getPortfolioMainQuery} variables={{ baseCoin }}>
            {({ loading, data }) => {
              const render = loading ? (
                <Loading centerAligned={true} />
              ) : (
                  <QueryRenderer
                    fetchPolicy="network-only"
                    component={Correlation}
                    query={getCorrelationQuery}
                    // quick fix until I have free time
                    variables={{
                      startDate: endDate,
                      endDate: startDate,
                    }}
                    {...{ portfolio: data, ...props }}
                  />
                )
              return render
            }}
          </Query>
        )}
    </PTWrapper>
  )
}

const PTWrapper = styled(PTWrapperRaw)`
  width: 98%;
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
    dispatch(setCorrelationPeriodAction(payload)),
})

const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CorrelationWrapper)

export default storeComponent
