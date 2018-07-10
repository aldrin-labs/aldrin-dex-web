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

// import HeatMapChart from '@components/HeatMapChart'
// import { HeatMapMocks } from './mocks'
import CorrelationMatrix from './CorrelationMatrix/CorrelationMatrix'
import { optimizeMocks } from '../../../../../utils/PortfolioCorrelationUtils'
import { IProps } from './Correlation.types'
import { toggleCorrelationTableFullscreen } from '../../../actions'
import { getCorrelationQuery, CORRELATION_UPDATE } from '../../../api'

class Correlation extends React.Component<IProps, IState> {
  initializeArray = (length: number, start: number, step: number): number[] =>
    Array.from({ length: Math.ceil((length - start) / step + 1) }).map(
      (v, i) => i * step + start
    )

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
    const {
      children,
      isFullscreenEnabled,
      data,
      mockData,
      isShownMocks,
    } = this.props
    // const { cols, rows } = optimizeMocks()

    return (
      <Subscription subscription={CORRELATION_UPDATE}>
        {(subscriptionData) => {
          let cols = []

          if (isShownMocks) {
            cols = mockData.map(
              (el: { coin: string; percentage: number }) => el.coin
            )
          }

          const rows = cols

          return (
            <PTWrapper tableData={!!cols.length && !!rows.length}>
              {children}
              {cols.length === 0 ? (
                this.renderPlaceholder()
              ) : (
                <Wrapper>
                  <CorrelationMatrix
                    fullScreenChangeHandler={this.props.toggleFullscreen}
                    isFullscreenEnabled={isFullscreenEnabled || false}
                    cols={cols}
                    rows={rows}
                  />

                  {/* <HeatMapChart
            data={getHeatMapData(HeatMapMocks)}
            width={500}
            height={500}
          /> */}
                </Wrapper>
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
    const { startDate, endDate } = this.props

    return (
      <Wrapper>
        <QueryRenderer
          component={Correlation}
          query={getCorrelationQuery}
          variables={{
            startDate,
            endDate,
          }}
          {...this.props}
        />
      </Wrapper>
    )
  }
}

const PTWrapper = styled.div`
  min-width: 70vw;
  min-height: 75vh;
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
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
  max-width: 90vw;
  height: 80%;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
`

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  mockData: store.portfolio.optimizationData,
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
