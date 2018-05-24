import * as React from 'react'
import styled from 'styled-components'
// import HeatMapChart from '@components/HeatMapChart'
// import { HeatMapMocks } from './mocks'
import CorrelationMatrix from './CorrelationMatrix'
import { optimizeMocks } from '../../../../../utils/PortfolioCorrelationUtils'
import { IProps } from './Correlation.types'

export default class Correlation extends React.Component<IProps> {
  initializeArray = (length: number, start: number, step: number): number[] =>
    Array.from({ length: Math.ceil((length - start) / step + 1) }).map(
      (v, i) => i * step + start
    )

  render() {
    const { children } = this.props
    const { cols, rows } = optimizeMocks()

    return (
      <PTWrapper tableData={!!cols.length && !!rows.length}>
        {children}
        <Wrapper>
          <ScrolledWrapper>
            <CorrelationMatrix cols={cols} rows={rows} />
          </ScrolledWrapper>

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
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 240px);' : '100%'};
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

const ScrolledWrapper = styled.div`
  overflow-y: scroll;
  background-color: #393e44;
  margin: 0 auto;
  margin-bottom: 3.125rem;

  &::-webkit-scrollbar {
    width: 0.75rem;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

const Wrapper = styled.div`
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
`
