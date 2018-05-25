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
                    color: '#fff',
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
                el.map((e: string, indx: number) => {
                  const value = onFloorN(Number(e), 2)
                  const { backgroundColor, textColor } = getColor(e)

                  return (
                    <Item key={e} textColor={textColor} color={backgroundColor}>
                      <div>
                        {value}
                        <TT>{`${rows[i]} - ${rows[indx]}`}</TT>
                      </div>
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

const TT = styled.span`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  color: #dfdfdf;
  text-decoration: none;
  padding: 3px;
  margin-left: -3.5%;
  margin-top: -2%;
  background-color: #292d31;

  border-radius: 3px;

  transition: visibility 0.2s linear 1s, opacity 0.2s linear 1s;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #292d31 transparent transparent transparent;
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
  color: ${(props) => props.textColor};
  font-weight: 500;
  padding: 0.5em;
  width: 50px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #fff;

  &:hover ${TT} {
    visibility: visible;
    opacity: 1;
  }
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`

export default CorrelationMatrix
