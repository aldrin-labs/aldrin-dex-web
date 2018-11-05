import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Joyride from 'react-joyride'

import QueryRenderer from '@components/QueryRenderer'
import { CorrelationMatrixMockData } from '@containers/Portfolio/components/PortfolioTable/Correlation/mocks'
import { CorrelationMatrix } from '@storybook-components'
import { IProps } from '@containers/Portfolio/components/PortfolioTable/Correlation/Correlation.types'
import {
  toggleCorrelationTableFullscreen,
  setCorrelationPeriod as setCorrelationPeriodAction,
} from '@containers/Portfolio/actions'
import { getCorrelationQuery } from '@containers/Portfolio/api'
import { swapDates } from '@utils/PortfolioTableUtils'
import { PTWrapper as PTWrapperRaw } from '../Main/PortfolioTableBalances/PortfolioTableBalances.styles'
import { testJSON } from '@utils/chartPageUtils'
import { CustomError } from '@components/ErrorFallback/ErrorFallback'
import { portfolioCorrelationSteps } from '@utils/joyrideSteps'

const Correlation = (props: IProps) => {
  const {
    children,
    isFullscreenEnabled,
    period,
    setCorrelationPeriodToStore,

    startDate,
    endDate,
  } = props

  let dataRaw = {}
  if (
    props.data.myPortfolios &&
    props.data.myPortfolios.length > 0 &&
    typeof props.data.myPortfolios[0].correlationMatrixByDay === 'string' &&
    props.data.myPortfolios[0].correlationMatrixByDay.length > 0
  ) {
    const matrix = props.data.myPortfolios[0].correlationMatrixByDay
    dataRaw = testJSON(matrix) ? JSON.parse(matrix) : matrix
  } else {
    return <CustomError error={'wrongShape'} />
  }

  return (
    <>
      {children}
      <CorrelationMatrix
        fullScreenChangeHandler={props.toggleFullscreen}
        isFullscreenEnabled={isFullscreenEnabled || false}
        data={dataRaw}
        setCorrelationPeriod={setCorrelationPeriodToStore}
        period={period}
        dates={{ startDate, endDate }}
      />
    </>
  )
}

const CorrelationWrapper = (props: IProps) => {
  const { isShownMocks, children } = props
  let { startDate, endDate } = props

  // startDate must be less always
  //  but if somehow not I will swap them
  if (startDate > endDate) {
    startDate = swapDates({ startDate, endDate }).startDate
    endDate = swapDates({ startDate, endDate }).endDate
  }

  return (
    <PTWrapper>
      <Joyride
        steps={portfolioCorrelationSteps}
        run={true}
      />
      {isShownMocks ? (
        <Correlation
          data={{
            myPortfolios: [
              {
                correlationMatrixByDay: JSON.stringify(
                  CorrelationMatrixMockData
                ),
              },
            ],
          }}
          children={children}
          {...props}
        />
      ) : (
        <QueryRenderer
          fetchPolicy="network-only"
          component={Correlation}
          query={getCorrelationQuery}
          variables={{
            startDate,
            endDate,
          }}
          {...props}
        />
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
