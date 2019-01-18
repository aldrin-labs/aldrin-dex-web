import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Joyride from 'react-joyride'

import { IProps } from './Correlation.types'
import { swapDates } from '@core/utils/PortfolioTableUtils'
import { PTWrapper as PTWrapperRaw } from '@storybook/styles/cssUtils'
import { portfolioCorrelationSteps } from '@utils/joyrideSteps'
import * as actions from '@containers/User/actions'
import {
  toggleCorrelationTableFullscreen,
  setCorrelationPeriod as setCorrelationPeriodAction,
} from '@containers/Portfolio/actions'

import Correlation from '@core/components/CorrelationMatrix'

const CorrelationWrapper = (props: IProps) => {
  const { isShownMocks, children, theme, tab } = props
  let { startDate, endDate } = props
  let key = 0

  // startDate must be less always
  //  but if somehow not I will swap them
  if (startDate > endDate) {
    startDate = swapDates({ startDate, endDate }).startDate
    endDate = swapDates({ startDate, endDate }).endDate
  }

  const handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    )
      props.hideToolTip('Correlation')
    if (data.status === 'finished') {
      key = key + 1
    }
  }

  return (
    <PTWrapper>
      <Joyride
        steps={portfolioCorrelationSteps}
        run={props.toolTip.portfolioCorrelation && tab === 'correlation'}
        callback={handleJoyrideCallback}
        key={key}
        styles={{
          options: {
            backgroundColor: theme.palette.getContrastText(
              theme.palette.primary.main
            ),
            primaryColor: theme.palette.secondary.main,
            textColor: theme.palette.primary.main,
          },
          tooltip: {
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.fontSize,
          },
        }}
      />
      <Correlation
        theme={theme}
      />
    </PTWrapper>
  )
}

const PTWrapper = styled(PTWrapperRaw)`
  width: 98%;
`

const mapStateToProps = (store: any) => ({
  startDate: store.portfolio.correlationStartDate,
  endDate: store.portfolio.correlationEndDate,
  period: store.portfolio.correlationPeriod,
  toolTip: store.user.toolTip,
})

const mapDispatchToProps = (dispatch: any) => ({
  toggleFullscreen: (data: any) => dispatch(toggleCorrelationTableFullscreen()),
  setCorrelationPeriodToStore: (payload: object) =>
    dispatch(setCorrelationPeriodAction(payload)),
  hideToolTip: (tab: string) => dispatch(actions.hideToolTip(tab)),
})

const storeComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CorrelationWrapper)

export default storeComponent
