import * as React from 'react'
import { Subscription } from 'react-apollo'
import styled from 'styled-components'
import { connect } from 'react-redux'
import QueryRenderer from '@components/QueryRenderer'

// import HeatMapChart from '@components/HeatMapChart'
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
} from '@containers/Portfolio/api'

class Correlation extends React.Component<IProps> {
  render() {
    const {
      children,
      isFullscreenEnabled,
      period,
      setCorrelationPeriodToStore,
    } = this.props
    let data = {}
    if (
      typeof this.props.data.correlationMatrixByDay === 'string' &&
      this.props.data.correlationMatrixByDay.length > 0
    ) {
      data = JSON.parse(this.props.data.correlationMatrixByDay)
    } else {
      data = this.props.data.correlationMatrixByDay
    }

    return (
      <Subscription subscription={CORRELATION_UPDATE}>
        {(subscriptionData) => {
          console.log(data)

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
      setCorrelationPeriodToStore,
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
          <QueryRenderer
            component={Correlation}
            query={getCorrelationQuery}
            variables={{
              startDate: 1531441380, //
              endDate: 1531873380,
            }}
            {...this.props}
          />
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
