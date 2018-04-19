import * as React from 'react'
import styled from 'styled-components'

const mocks = [
  { id: 1, name: 'SAP500', value: 21 },
  { id: 2, name: 'Cons. Disc.', value: 33 },
  { id: 3, name: 'Cons. Stap.', value: 31 },
  { id: 4, name: 'Energy', value: 45 },
  { id: 5, name: 'Financials', value: 10 },
  { id: 6, name: 'H Care', value: 78 },
  { id: 3, name: 'Industrials', value: 11 },
  { id: 4, name: 'Materials', value: 15 },
  { id: 5, name: 'Technology', value: 29 },
  { id: 6, name: 'Oil', value: 28 },
]

export default class Correlation extends React.Component {
  initializeArray = (length: number, start: number, step: number): number[] => {
    return Array.from({ length: Math.ceil((length - start) / step + 1) }).map(
      (v, i) => i * step + start
    )
  }

  floorN = (x: number, n: number) => {
    var mult = Math.pow(10, n)
    return Math.floor(x * mult) / mult
  }

  render() {
    const rows = this.initializeArray(mocks.length - 1, 0, 1)

    return (
      <Wrapper>
        <Table>
          <thead>
            <Row>
              <HeadItem style={{ width: '5em' }} />
              {mocks.map((el) => <HeadItem key={el.name}>{el.name}</HeadItem>)}
            </Row>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowValue = mocks[row]

              return (
                <Row key={row}>
                  {rowValue && (
                    <Item style={{ textAlign: 'right', border: 'none' }}>
                      {rowValue.name}
                    </Item>
                  )}
                  {mocks.map((el) => {
                    const value = this.floorN(rowValue.value / el.value, 2)
                    let color

                    if (value > 1) {
                      color = 'green'
                    } else if (value < 1) {
                      color = 'red'
                    } else {
                      color = 'blue'
                    }

                    return (
                      <Item key={el.name} color={color}>
                        {value}
                      </Item>
                    )
                  })}
                </Row>
              )
            })}
          </tbody>
        </Table>
      </Wrapper>
    )
  }
}

const HeadItem = styled.th`
  font-family: Roboto;
  font-size: 0.75em;
  color: #fff;
  font-weight: 500;
  padding: 10px;
  text-align: center;
  width: 3em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Row = styled.tr``

const Item = styled.td`
  background-color: ${(props: { color?: string }) => {
    if (props.color === 'green') return '#4caf50'
    if (props.color === 'red') return '#f44336'
    if (props.color === 'blue') return '#2196f3'
    return 'transparent'
  }};

  font-family: Roboto;
  font-size: 0.75em;
  color: #fff;
  font-weight: 500;
  padding: 10px;
  text-align: center;
  width: 3em;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #fff;
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  width: 800px;
`

const Wrapper = styled.div`
  padding: 16px;
`
