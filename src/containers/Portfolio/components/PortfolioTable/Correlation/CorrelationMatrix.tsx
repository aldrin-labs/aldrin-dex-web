import React, { Component } from 'react'
import styled from 'styled-components'

import { onFloorN } from '../../../../../utils/PortfolioTableUtils'
import {
  getColor,
  optimizeMocks,
} from '../../../../../utils/PortfolioCorrelationUtils'

class CorrelationMatrix extends Component {
  render() {
    const { cols, rows } = optimizeMocks()

    return (
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
    )
  }
}

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

export default CorrelationMatrix
