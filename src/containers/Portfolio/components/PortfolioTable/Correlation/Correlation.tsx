import * as React from 'react'
import styled from 'styled-components'
import HeatMapChart from '@components/HeatMapChart'
import CORRELATION_MOCKS from 'utils/corr_matrices_total.json'
import { onFloorN } from '../../../../../utils/PortfolioTableUtils'

function optimizeMocks(): { rows: string[]; cols: any[][] } {
  const m = JSON.parse(CORRELATION_MOCKS['2018-04-24'])
  const o = Object.keys(m).map((key) => {
    return { [key]: m[key] }
  })
  const rows = o.map((a) => {
    const arr = Object.keys(a)
    return arr[0].slice(0, -7)
  })

  const cols = o.map((a) => {
    return Object.keys(a).map((key) => {
      const s = a[key]
      return Object.keys(s).map((key) => s[key])
    })
  })
  return { rows, cols }
}

optimizeMocks()

const HeatMapMocks = [
  { pair: 'BTC/ETH', values: [{ v: '0.87' }, { v: '0.54' }] },
  { pair: 'BTC/XRP', values: [{ v: '0.26' }, { v: '0.48' }] },
  { pair: 'ETH/XRP', values: [{ v: '0.62' }, { v: '0.89' }] },
  { pair: 'BTC/BCH', values: [{ v: '1' }, { v: '0.88' }] },
  { pair: 'ETH/BCH', values: [{ v: '-0.02' }, { v: '0.14' }] },
  { pair: 'XRP/BCH', values: [{ v: '-0.56' }, { v: '-0.94' }] },
  { pair: 'BTC/LTC', values: [{ v: '0.01' }, { v: '-0.98' }] },
]

function getColor(value: string): string {
  const n = Number(value)
  if (n >= 0.9) {
    return '#1B5E20'
  } else if (n >= 0.8 && n < 0.9) {
    return '#2E7D32'
  } else if (n >= 0.7 && n < 0.8) {
    return '#388E3C'
  } else if (n >= 0.6 && n < 0.7) {
    return '#43A047'
  } else if (n >= 0.5 && n < 0.6) {
    return '#4CAF50'
  } else if (n >= 0.4 && n < 0.5) {
    return '#66BB6A'
  } else if (n >= 0.3 && n < 0.4) {
    return '#81C784'
  } else if (n >= 0.2 && n < 0.3) {
    return '#A5D6A7'
  } else if (n >= 0.1 && n < 0.2) {
    return '#C8E6C9'
  } else if (n >= 0 && n < 0.1) {
    return '#E8F5E9'
  } else if (n >= -0.1 && n < 0) {
    return '#B9F6CA'
  } else if (n >= -0.2 && n < -0.1) {
    return '#FFEBEE'
  } else if (n >= -0.3 && n < -0.2) {
    return '#FFCDD2'
  } else if (n >= -0.4 && n < -0.3) {
    return '#EF9A9A'
  } else if (n >= -0.5 && n < -0.4) {
    return '#E57373'
  } else if (n >= -0.6 && n < -0.5) {
    return '#EF5350'
  } else if (n >= -0.7 && n < -0.6) {
    return '#F44336'
  } else if (n >= -0.8 && n < -0.7) {
    return '#E53935'
  } else if (n >= -0.9 && n < -0.8) {
    return '#D32F2F'
  } else if (n >= -1 && n < -0.9) {
    return '#C62828'
  }
}

function getHeatMapData(
  data: { pair: string; values: { [key: string]: string }[] }[]
) {
  const result: { x: number; y: number }[] = []
  data.forEach((item, i) => {
    item.values.forEach((value, idx) => {
      result.push({
        x: i + 1,
        y: idx * 2,
        color: getColor(value.v),
      })
    })
  })

  return result
}

export default class Correlation extends React.Component {
  initializeArray = (length: number, start: number, step: number): number[] => {
    return Array.from({ length: Math.ceil((length - start) / step + 1) }).map(
      (v, i) => i * step + start
    )
  }

  render() {
    const { cols, rows } = optimizeMocks()

    return (
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
              {cols.map((col, i) => {
                return (
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
                    {col.map((el) => {
                      return el.map((e) => {
                        const value = onFloorN(Number(e), 2)
                        const color = getColor(e)

                        return (
                          <Item key={e} color={color}>
                            {value}
                          </Item>
                        )
                      })
                    })}
                  </Row>
                )
              })}
            </tbody>
          </Table>
        </ScrolledWrapper>

        <HeatMapChart
          data={getHeatMapData(HeatMapMocks)}
          width={500}
          height={500}
        />
      </Wrapper>
    )
  }
}

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
    if (props.color) return props.color
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
