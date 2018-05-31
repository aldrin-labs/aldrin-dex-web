import * as React from 'react'
import styled from 'styled-components'
import HeatMapChart from '@components/HeatMapChart'
import { HeatMapMocks } from './mocks'
import { onFloorN } from '../../../../../utils/PortfolioTableUtils'
import {
  getColor,
  getHeatMapData,
  optimizeMocks,
} from '../../../../../utils/PortfolioCorrelationUtils'
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
            <Table>
              <thead>
                <Row>
                  <HeadItem
                    style={{
                      width: '4em',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#393e44',
                    }}
                  />
                  {rows.map((row) => <HeadItem key={row}>{row}</HeadItem>)}
                </Row>
              </thead>
              <tbody>
                {cols.map((col, i) => (
                  <Row key={rows[i]}>
                    {rows[i] && (
                      <Item
                        style={{
                          textAlign: 'right',
                          border: 'none',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: '#393e44',
                        }}
                      >
                        {rows[i]}
                      </Item>
                    )}
                    {col.map((el) =>
                      el.map((e: string) => {
                        const value = onFloorN(Number(e), 2)
                        const color = getColor(e)

                        return (
                          <Item key={e} color={color}>
                            {value}
                          </Item>
                        )
                      })
                    )}
                  </Row>
                ))}
              </tbody>
            </Table>
          </ScrolledWrapper>

          {/*<HeatMapChart*/}
          {/*data={getHeatMapData(HeatMapMocks)}*/}
          {/*width={500}*/}
          {/*height={500}*/}
          {/*/>*/}
        </Wrapper>
      </PTWrapper>
    )
  }
}

const PTWrapper = styled.div`
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
`

const ScrolledWrapper = styled.div`
  max-width: 800px;
  overflow-y: scroll;
  background-color: #393e44;
  margin-bottom: 50px;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

const HeadItem = styled.th`
  font-family: Roboto;
  font-size: 0.75em;
  color: #fff;
  font-weight: 500;
  padding: 0.5em;
  width: 50px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: sticky;
  background-color: #393e44;
  top: 0;
`

const Row = styled.tr``

const Item = styled.td`
  background-color: ${(props: { color?: string }) => {
    if (props.color) {
      return props.color
    }

    return 'transparent'
  }};

  font-family: Roboto;
  font-size: 0.75em;
  color: #fff;
  font-weight: 500;
  padding: 0.5em;
  width: 50px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #fff;
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
`
