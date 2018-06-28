import * as React from 'react'
import styled from 'styled-components'
// import HeatMapChart from '@components/HeatMapChart'
// import { HeatMapMocks } from './mocks'
import FullScreenIcon from 'react-icons/lib/md/fullscreen'
import CorrelationMatrix from './CorrelationMatrix/CorrelationMatrix'
import { optimizeMocks } from '../../../../../utils/PortfolioCorrelationUtils'
import { IProps, IState } from './Correlation.types'

export default class Correlation extends React.Component<IProps> {
  state: IState = {
    isFullscreenEnabled: false,
  }

  initializeArray = (length: number, start: number, step: number): number[] =>
    Array.from({ length: Math.ceil((length - start) / step + 1) }).map(
      (v, i) => i * step + start
    )

  fullScreenChangeHandler = (isFullscreenEnabled: boolean) => {
    this.setState({ isFullscreenEnabled })
  }

  render() {
    const { children } = this.props
    const { cols, rows } = optimizeMocks()

    return (
      <PTWrapper tableData={!!cols.length && !!rows.length}>
        {children}
        <Button onClick={() => this.setState({ isFullscreenEnabled: true })}>
          <FullScreenIcon />
        </Button>
        <Wrapper>
          <CorrelationMatrix
            fullScreenChangeHandler={this.fullScreenChangeHandler}
            isFullscreenEnabled={this.state.isFullscreenEnabled || false}
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
const Button = styled.button`
  z-index: 100;
  color: #fff;
  border-color: transparent;
  padding: 10px 30px;
  border-radius: 3px;
  background-color: transparent;
  font-size: 2rem;
  text-align: center;
  cursor: pointer;

  position: absolute;
  right: 2rem;
  top: 0.8rem;

  outline: none;
  box-sizing: border-box;
`
