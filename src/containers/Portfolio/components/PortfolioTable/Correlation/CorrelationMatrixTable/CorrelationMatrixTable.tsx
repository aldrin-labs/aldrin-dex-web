import React, { PureComponent } from 'react'
import styled from 'styled-components'

import {
  optimizeMocks,
  getColor,
} from '../../../../../../utils/PortfolioCorrelationUtils'
import { onFloorN } from '../../../../../../utils/PortfolioTableUtils'

const { cols, rows } = optimizeMocks()

class CorrelationMatrixTable extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      isFullscreenEnabled,
      onTableMouseLeave,
      onTableMouseOver,
      onMouseOver,
    } = this.props

    const tableStyle = isFullscreenEnabled
      ? { width: '100vw', height: '100vh' }
      : {}

    return (
      <Table style={tableStyle}>
        <thead>
          <Row
            style={{
              position: isFullscreenEnabled ? 'fixed' : 'sticky',
            }}
          >
            <HeadItem
              style={{
                width: '4em',
                position: isFullscreenEnabled ? 'static' : 'sticky',
                left: 0,
                backgroundColor: '#393e44',
              }}
            />
            {rows.map((row) => <HeadItem key={row}>{row}</HeadItem>)}
          </Row>
        </thead>
        <tbody onMouseLeave={onTableMouseLeave} onMouseOver={onTableMouseOver}>
          {cols.map((col, i) => (
            <Row key={rows[i]}>
              {rows[i] && (
                <Item
                  style={{
                    color: '#fff',
                    textAlign: 'right',
                    border: 'none',
                    position: isFullscreenEnabled ? 'static' : 'sticky',
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
                    <Item
                      key={e}
                      textColor={textColor}
                      color={backgroundColor}
                      onMouseOver={(event) =>
                        onMouseOver(
                          indx,
                          value,
                          rows[i],
                          rows[indx],
                          event.nativeEvent.clientX,
                          event.nativeEvent.clientY
                        )
                      }
                    >
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
  font-family: Roboto, sans-serif;
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
  user-select: none;
`

const Row = styled.tr``

const Item = styled.td`
  background-color: ${(props: { color?: string }) => {
    if (props.color) {
      return props.color
    }

    return 'transparent'
  }};

  position: ${(props) => (props.position ? 'relative' : 'static')};

  font-family: Roboto, sans-serif;
  font-size: 0.75em;
  color: ${(props) => props.textColor};
  font-weight: 500;
  padding: 0.5em;
  width: 50px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #fff;

  cursor: help;
  user-select: none;
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
`

export default CorrelationMatrixTable
