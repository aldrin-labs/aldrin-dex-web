import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { FaAngleDown, FaAngleRight } from 'react-icons/lib/fa/'

import {
  optimizeMocks,
  getColor,
} from '../../../../../../utils/PortfolioCorrelationUtils'
import { onFloorN } from '../../../../../../utils/PortfolioTableUtils'

const { cols: mockCols } = optimizeMocks()

class CorrelationMatrixTable extends PureComponent {
  state = {
    activeRow: null,
    activeColumn: null,
  }

  render() {
    const { isFullscreenEnabled, cols: c, rows } = this.props
    const { activeRow, activeColumn } = this.state

    // this bullshit needs to be removed when correlation API are done
    let cols = mockCols
      .map((col) => col[0].slice(0, rows.length))
      .slice(0, rows.length)

    if (!(Array.isArray(cols) && Array.isArray(rows))) {
      return null
    }

    const tableStyle = isFullscreenEnabled
      ? { width: '100vw', height: '100vh' }
      : {}

    // console.dir(cols)
    // console.log(rows)

    return (
      <GridTable
        onMouseLeave={() => {
          this.setState({ activeRow: null, activeColumn: null })
        }}
        rows={cols.length + 1}
        columns={cols[0].length + 1}
      >
        {/* first empty cell */}
        <Cell />

        {/* first row with coin names */}
        {rows.map((el, i) => (
          <HeadCell
            textColor={activeRow === i ? '#4ed8da' : 'black'}
            key={el.toString()}
          >
            <StyledArrowDown show={activeRow === i} />

            {el}
          </HeadCell>
        ))}

        {/* first column with coin names */}
        {rows.map((el, i) => (
          <HeadCell
            textColor={activeColumn === i ? '#4ed8da' : 'black'}
            style={{ gridColumnStart: 1 }}
            key={el.toString()}
          >
            <StyledArrowRight show={activeColumn === i} />
            {el}
          </HeadCell>
        ))}

        {/* content */}
        {cols.map((col, ind) =>
          col.map((el: number, i: number) => (
            <Cell
              onMouseOver={() => {
                this.setState({ activeRow: i, activeColumn: ind })
                console.log(i)
                console.log(ind)
              }}
              style={{ gridColumnStart: i + 2, gridRowStart: ind + 2 }}
              key={el.toString()}
            >
              <CellContent active={i === activeRow && ind === activeColumn}>
                {el.toFixed(2)}
              </CellContent>
            </Cell>
          ))
        )}
      </GridTable>
    )
  }
}

const StyledArrowRight = styled(FaAngleRight)`
  opacity: ${(props: { show?: boolean }) => (props.show ? '1' : '0')};
  left: 0;
  color: #4ed8da;
  position: absolute;
  transition: opacity 0.25s ease-out;
`
const StyledArrowDown = styled(FaAngleDown)`
  opacity: ${(props: { show?: boolean }) => (props.show ? '1' : '0')};
  top: 0;
  color: #4ed8da;
  position: absolute;
  transition: opacity 0.25s ease-out;
`

const GridTable = styled.div`
  max-width: 100%;
  max-height: 100%;
  display: grid;
  grid-template-rows: ${(props) => `repeat(${props.rows}, 4rem)`};
  grid-template-columns: ${(props) => `repeat(${props.columns}, 4rem)`};
`

const CellContent = styled.div`
  padding: 0.25rem;
  width: ${(props: { active?: boolean }) => (props.active ? '100%' : '97%')};
  height: ${(props: { active?: boolean }) => (props.active ? '100%' : '97%')};
  border: ${(props: { active?: boolean }) =>
    props.active ? '2px solid #4ed8da' : '1px solid #292d31'};
  transition: border 0.25s ease-in-out;
`

const Cell = styled.div`
  z-index: 100;
  background-color: ${(props: { color?: string }) => {
    if (props.color) {
      return props.color
    }

    return 'transparent'
  }};
  font-family: Roboto, sans-serif;
  font-size: 1rem;
  color: ${(props: { textColor: string }) => props.textColor};
  font-weight: 500;
  display: flex;
  place-content: center;
  place-items: center;
  text-align: center;
  line-height: 3rem;
  overflow: hidden;
  white-space: nowrap;
  transition: color 0.25s ease-out;
`

const HeadCell = Cell.extend`
  position: relative;
`

export default CorrelationMatrixTable
