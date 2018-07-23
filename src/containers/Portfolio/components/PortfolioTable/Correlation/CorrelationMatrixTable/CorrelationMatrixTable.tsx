import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { FaAngleDown, FaAngleRight } from 'react-icons/lib/fa'
import shortid from 'shortid'

import { getColor } from '@utils/PortfolioCorrelationUtils'
import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Correlation/CorrelationMatrixTable/CorrelationMatrixTable.types'
class CorrelationMatrixTable extends PureComponent<IProps, IState> {
  state: IState = {
    activeRow: null,
    activeColumn: null,
  }

  onCellMouseOver = (activeRow: number, activeColumn: number) => {
    this.setState({ activeRow, activeColumn })
  }

  onMouseLeave = () => {
    this.setState({ activeRow: null, activeColumn: null })
  }

  render() {
    const { isFullscreenEnabled, data } = this.props
    const { activeRow, activeColumn } = this.state

    const cols = data.values
    const rows = data.header

    // console.dir(cols)
    // console.log(rows)

    return (
      <GridTable
        isFullscreenEnabled={isFullscreenEnabled}
        onMouseLeave={this.onMouseLeave}
        rows={cols.length + 1}
        columns={cols[0].length + 1}
      >
        {/* first empty cell */}
        <HeadCell sticky={!isFullscreenEnabled} style={{ zIndex: 102 }} />

        {/* first row with coin names */}
        {rows.map((el, i) => (
          <HeadCell
            cols={cols[0].length}
            isFullscreenEnabled={isFullscreenEnabled}
            sticky={!isFullscreenEnabled}
            textColor={activeRow === i ? '#4ed8da' : '#dedede'}
            key={el}
          >
            <StyledArrowDown show={activeRow === i} />

            {el}
          </HeadCell>
        ))}

        {/* first column with coin names */}
        {rows.map((el, i) => (
          <HeadCell
            cols={cols[0].length}
            isFullscreenEnabled={isFullscreenEnabled}
            sticky={false}
            textColor={activeColumn === i ? '#4ed8da' : '#dedede'}
            style={{ gridColumnStart: 1 }}
            key={el}
          >
            <StyledArrowRight show={activeColumn === i} />
            {el}
          </HeadCell>
        ))}

        {/* content */}
        {cols.map((col, ind) =>
          col.map((el: string, i: number) => {
            const { backgroundColor, textColor } = getColor(el)

            return (
              <Cell
                cols={cols[0].length}
                isFullscreenEnabled={isFullscreenEnabled}
                textColor={textColor}
                onMouseOver={() => {
                  this.onCellMouseOver(i, ind)
                }}
                style={{ gridColumnStart: i + 2, gridRowStart: ind + 2 }}
                key={shortid.generate()}
              >
                <CellContent
                  color={backgroundColor}
                  active={i === activeRow && ind === activeColumn}
                >
                  {Number(el).toFixed(2)}
                </CellContent>
              </Cell>
            )
          })
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
  width: 59%;
  height: 100%;
  display: grid;
  background: ${(props) =>
    props.isFullscreenEnabled ? '#393e44' : 'transparent'};
  grid-template-rows: ${(props) =>
    props.isFullscreenEnabled
      ? `repeat(${props.rows}, ${100 / props.rows}vh)`
      : `repeat(${props.rows}, 1fr)`};
  grid-template-columns: ${(props) =>
    props.isFullscreenEnabled
      ? `repeat(${props.columns}, ${100 / props.columns}vw)`
      : `repeat(${props.columns}, 1fr)`};
`

const CellContent = styled.div`
  background-color: ${(props: { color?: string }) => {
    if (props.color) {
      return props.color
    }

    return 'transparent'
  }};
  padding: 0.25rem;
  width: ${(props: { active?: boolean }) => (props.active ? '100%' : '97%')};
  height: ${(props: { active?: boolean }) => (props.active ? '100%' : '97%')};
  border: ${(props: { active?: boolean }) =>
    props.active ? '2px solid #4ed8da' : '1px solid #292d31'};
  transition: border 0.25s ease-in-out;
`

const Cell = styled.div`
  z-index: 100;

  font-family: Roboto, sans-serif;
  font-size: ${(props: { isFullscreenEnabled: boolean; cols: number }) => {
    const { isFullscreenEnabled, cols } = props

    if (!isFullscreenEnabled) {
      return '1rem'
    }

    if (isFullscreenEnabled && cols > 1 && cols < 5) {
      return '4rem'
    }
    if (isFullscreenEnabled && cols > 5 && cols <= 10) {
      return '3rem'
    }
    if (isFullscreenEnabled && cols > 10 && cols <= 15) {
      return '2rem'
    }
    if (isFullscreenEnabled && cols > 15 && cols <= 20) {
      return '1rem'
    }
    if (isFullscreenEnabled && cols > 20) {
      return '0.5rem'
    }

    return '1rem'
  }};
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
  z-index: 101;
  background: #393e44;
  position: relative;
  position: ${(props) => (props.sticky ? 'sticky' : 'relative')};
  top: 0;
`

export default CorrelationMatrixTable
