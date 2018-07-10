import React, { PureComponent } from 'react'
import styled from 'styled-components'

import {
  optimizeMocks,
  getColor,
} from '../../../../../../utils/PortfolioCorrelationUtils'
import { onFloorN } from '../../../../../../utils/PortfolioTableUtils'

const { cols: mockCols } = optimizeMocks()

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
      cols: c,
      rows,
    } = this.props

    // this bullshit needs to be removed when correlation API are done
    const cols = mockCols
      .map((col) => col[0].slice(0, rows.length))
      .slice(0, rows.length)

    if (!(Array.isArray(cols) && Array.isArray(rows))) {
      return null
    }

    const tableStyle = isFullscreenEnabled
      ? { width: '100vw', height: '100vh' }
      : {}

    console.log(cols)
    console.log(rows)

    return (
      <GridTable rows={4} columns={4}>
        <Cell color="black" textColor="white">
          1
        </Cell>
        <Cell color="black" textColor="white">
          1
        </Cell>
        <Cell color="black" textColor="white">
          1
        </Cell>
        <Cell color="black" textColor="white">
          1
        </Cell>
        <Cell color="black" textColor="white">
          1
        </Cell>
        <Cell color="black" textColor="white">
          1
        </Cell>
        <Cell color="black" textColor="white">
          1
        </Cell>
        <Cell color="black" textColor="white">
          1
        </Cell>
      </GridTable>

      // <Table style={tableStyle}>
      //   <thead>
      //     <Row>
      //       <HeadItem
      //         isFullscreenEnabled={isFullscreenEnabled}
      //         style={{
      //           width: '4em',
      //           backgroundColor: '#393e44',
      //         }}
      //       />
      //       {rows.map((row) => (
      //         <HeadItem isFullscreenEnabled={isFullscreenEnabled} key={row}>
      //           {row}
      //         </HeadItem>
      //       ))}
      //     </Row>
      //   </thead>
      //   <tbody onMouseLeave={onTableMouseLeave} onMouseOver={onTableMouseOver}>
      //     {cols.map((col, i) => (
      //       <Row key={rows[i]}>
      //         {rows[i] && (
      //           <Item
      //             style={{
      //               color: '#fff',
      //               textAlign: 'right',
      //               border: 'none',
      //               left: 0,
      //               backgroundColor: '#393e44',
      //             }}
      //           >
      //             {rows[i]}
      //           </Item>
      //         )}
      //         {col.map((el, indx) => {
      //           const value = onFloorN(Number(el), 2)
      //           const { backgroundColor, textColor } = getColor(el)

      //           return (
      //             <Item
      //               key={el}
      //               textColor={textColor}
      //               color={backgroundColor}
      //               onMouseOver={(event) =>
      //                 onMouseOver(
      //                   indx,
      //                   value,
      //                   rows[i],
      //                   rows[indx],
      //                   event.nativeEvent.clientX,
      //                   event.nativeEvent.clientY
      //                 )
      //               }
      //             >
      //               {value}
      //             </Item>
      //           )
      //         })}
      //       </Row>
      //     ))}
      //   </tbody>
      // </Table>
    )
  }
}

const GridTable = styled.div`
  width: 80%;
  height: 100%;
  display: grid;
  grid-template-rows: ${(props) =>
    `repeat(${props.rows}, ${100 / props.rows}%)`};
  grid-template-columns: ${(props) =>
    `repeat(${props.columns}, ${100 / props.columns}%)`};
  gap: 1% 1%;
`

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
  position: ${(props: { isFullscreenEnabled: boolean }) =>
    props.isFullscreenEnabled ? 'static' : 'sticky'};
  background-color: #393e44;
  top: 0;
  user-select: none;
`

const Cell = styled.div`
  background-color: ${(props: { color?: string }) => {
    if (props.color) {
      return props.color
    }

    return 'transparent'
  }};
  font-family: Roboto, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.textColor};
  font-weight: 500;
  padding: 0.5em;

  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #fff;
`

const Table = styled.table`
  width: 80%;
  height: 100%;
  table-layout: fixed;
  border-collapse: collapse;
`

export default CorrelationMatrixTable
