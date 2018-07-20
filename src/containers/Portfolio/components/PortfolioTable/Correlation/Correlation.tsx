import * as React from 'react'
import { Subscription } from 'react-apollo'
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@material-ui/core'
import styled from 'styled-components'
import { connect } from 'react-redux'
import QueryRenderer from '@components/QueryRenderer'
import { has } from 'lodash'

// import HeatMapChart from '@components/HeatMapChart'
import {
  // HeatMapMocks,
  CorrelationMatrixMockData,
} from './mocks'
import CorrelationMatrix from './CorrelationMatrix/CorrelationMatrix'
import { IProps } from './Correlation.types'
import { toggleCorrelationTableFullscreen } from '../../../actions'
import { getCorrelationQuery, CORRELATION_UPDATE } from '../../../api'

class Correlation extends React.Component<IProps, IState> {
  renderPlaceholder = () => (
    <>
      <LinearProgress color="secondary" />

      <StyledCard>
        <CardContent>
          <Typography color="secondary" variant="headline">
            Empty Here...
          </Typography>
        </CardContent>
      </StyledCard>
    </>
  )

  render() {
    const { children, isFullscreenEnabled } = this.props
    let data = {}
    if (typeof this.props.data.correlationMatrixByDay === 'string') {
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
              {has(data, 'values') && data.values.length !== 0 ? (
                <>
                  <CorrelationMatrix
                    fullScreenChangeHandler={this.props.toggleFullscreen}
                    isFullscreenEnabled={isFullscreenEnabled || false}
                    data={
                      // has(subscriptionData, 'data') && subscriptionData.data
                      //   ? subscriptionData.data
                      //   : data
                      data
                    }
                  />

                  {/* <HeatMapChart
          data={getHeatMapData(HeatMapMocks)}
          width={500}
          height={500}
        /> */}
                </>
              ) : (
                this.renderPlaceholder()
              )}
            </PTWrapper>
          )
        }}
      </Subscription>
    )
  }
}

class CorrelationWrapper extends React.Component<IProps, IState> {
  state = {
    startDate: 0,
    endDate: 0,
    period: '',
  }

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
          <QueryRenderer
            component={Correlation}
            query={getCorrelationQuery}
            variables={{
              startDate: 1529193643,
              endDate: 1529218843,
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

const StyledCard = styled(Card)`
  && {
    width: 20%;
    height: 20%;
    margin: auto;
    background: #292d31;
  }
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
})

const mapDispatchToProps = (dispatch: any) => ({
  toggleFullscreen: (data: any) => dispatch(toggleCorrelationTableFullscreen()),
})

const storeComponent = connect(mapStateToProps, mapDispatchToProps)(
  CorrelationWrapper
)

export default storeComponent
