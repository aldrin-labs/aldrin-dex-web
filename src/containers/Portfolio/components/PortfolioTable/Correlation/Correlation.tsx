import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

// import HeatMapChart from '@components/HeatMapChart'
// import { HeatMapMocks } from './mocks'
import CorrelationMatrix from './CorrelationMatrix/CorrelationMatrix'
import { optimizeMocks } from '../../../../../utils/PortfolioCorrelationUtils'
import { IProps, IState } from './Correlation.types'
import { toggleCorrelationTableFullscreen } from '../../../actions'

class Correlation extends React.Component<IProps> {
  state: IState = {
    isFullscreenEnabled: false,
  }

  initializeArray = (length: number, start: number, step: number): number[] =>
    Array.from({ length: Math.ceil((length - start) / step + 1) }).map(
      (v, i) => i * step + start
    )

  fullScreenChangeHandler = (isFullscreenEnabled: boolean) => {
    if (isFullscreenEnabled) {
      console.log('here')
      return null
    } else {
      console.log('or here')
      this.props.toggleFullscreen()

      return null
    }
  }

  onButtonClick = () => this.setState({ isFullscreenEnabled: true })

  render() {
    const { children, isFullscreenEnabled } = this.props
    const { cols, rows } = optimizeMocks()
    console.log(isFullscreenEnabled)

    return (
      <PTWrapper tableData={!!cols.length && !!rows.length}>
        {children}

        <Wrapper>
          <CorrelationMatrix
            fullScreenChangeHandler={this.fullScreenChangeHandler}
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
      </PTWrapper>
    )
  }
}

const PTWrapper = styled.div`
  min-width: 70vw;
  display: flex;
  flex-direction: column;
  margin: 1.5rem;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: auto;
`

const Wrapper = styled.div`
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
`

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  data: store.portfolio.optimizationData,
  isFullscreenEnabled: store.portfolio.correlationTableFullscreenEnabled,
})

const mapDispatchToProps = (dispatch: any) => ({
  toggleFullscreen: (data: any) => dispatch(toggleCorrelationTableFullscreen()),
})
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(Correlation)

export default storeComponent
