import * as React from 'react'
import styled, { css } from 'styled-components'

import sortIcon from '@icons/arrow.svg'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import { customAquaScrollBar } from '@utils/cssUtils'
import { formatNumberToUSFormat } from '@utils/PortfolioTableUtils'
import { IRow } from '../PortfolioTableRebalance.types'
import { IProps, IState } from './CurrentPortfolioTable.types'

const usdHeadingForCurrent = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'USD', value: 'price' },
]

const btcHeadingForCurrent = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'BTC', value: 'price' },
]



export default class CurrentPortfolioTable extends React.Component<IProps, IState> {

  render() {
    const {
      isUSDCurrently,
      currentSortForStatic,
      totalStaticRows,
      staticRows,
      filterValueSmallerThenPercentage,
      onSortTable
    } = this.props

    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" />
    ) : (
      <Icon className="fa fa-btc" />
    )

    const tableHeadingsCurrentPortfolio = isUSDCurrently ? usdHeadingForCurrent : btcHeadingForCurrent


    return (
    <TableAndHeadingWrapper>
    <TableHeading>Current portfolio</TableHeading>
    <Wrapper>
      <Table style={{ width: '520px' }}>
        <PTHead>
          <PTR>
            {tableHeadingsCurrentPortfolio.map((heading) => {
              const isSorted =
                currentSortForStatic &&
                currentSortForStatic.key === heading.value

              return (
                <PTHC
                  key={heading.name}
                  onClick={() =>
                    onSortTable(heading.value, 'static')
                  }
                >
                  {heading.name}

                  {isSorted && (
                    <SvgIcon
                      src={sortIcon}
                      width={12}
                      height={12}
                      style={{
                        verticalAlign: 'middle',
                        marginLeft: '4px',
                        transform:
                          currentSortForStatic &&
                          currentSortForStatic.arg === 'ASC'
                            ? 'rotate(180deg)'
                            : null,
                      }}
                    />
                  )}
                </PTHC>
              )
            })}
          </PTR>
        </PTHead>

        <PTBody>
          {staticRows
            .filter(
              (row: IRow) =>
                row.portfolioPerc &&
                +row.portfolioPerc >
                (filterValueSmallerThenPercentage
                  ? filterValueSmallerThenPercentage
                  : 0)
            )
            .map((row: IRow, idx: number) => {
              const { exchange, symbol, portfolioPerc, price } = row

              const cols = [
                exchange,
                symbol || '',
                portfolioPerc ? `${portfolioPerc}%` : '',
                `${formatNumberToUSFormat(price)}`,
              ]

              return (
                <PTR key={`${exchange}${symbol}${idx}`}>
                  {cols.map((col, index) => {
                    if (col.match(/%/g)) {
                      const color =
                        Number(col.replace(/%/g, '')) >= 0
                          ? '#4caf50'
                          : '#f44336'

                      return (
                        <PTDC key={`${col}${index}`} style={{ color }}>
                          {col}
                        </PTDC>
                      )
                    }
                    if (index === 3) {
                      return (
                        <PTDC key={`${col}${idx}`}>
                          {mainSymbol}
                          {col}
                        </PTDC>
                      )
                    }

                    return <PTDC key={`${col}${index}`}>{col}</PTDC>
                  })}
                </PTR>
              )
            })}
        </PTBody>
        <PTFoot>
          <PTR>
            <PTHC>All</PTHC>
            <PTHC>-</PTHC>
            <PTHC>100%</PTHC>
            <PTHC>
              {mainSymbol}
              {formatNumberToUSFormat(totalStaticRows)}
            </PTHC>
          </PTR>
        </PTFoot>
      </Table>
    </Wrapper>
    </TableAndHeadingWrapper>
    )
  }
}

const TableAndHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;

  &:not(:first-child) {
    padding-left: 60px;
  }

  ${customAquaScrollBar};
`

const Wrapper = styled.div`
  overflow-y: scroll;
  padding-right: 2px;

  ${customAquaScrollBar};
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const TableHeading = styled.div`
  display: flex;
  text-transform: uppercase;
  font-family: Roboto, sans-serif;
  font-size: 17px;
  color: white;
  font-weight: bold;
  letter-spacing: 1.1px;
  min-height: 30px;
`

const PT = css`
  display: table;
  width: 100%;
  position: sticky;
  z-index: 1;


  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`

const PTHead = styled.thead`
  ${PT};
  top: 0;
  user-select: none;
`

const PTFoot = styled.tfoot`
  ${PT};
  bottom: 0;
  
    &::before {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px solid white;
  }
`

const PTD = css`
  color: white;

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  white-space: nowrap;

  & svg {
    width: 15px;
    height: 15px;
  }
`

const PTDC = styled.td`
  ${PTD};
  min-width: 100px;
  overflow: hidden;

  &:nth-child(2) {
    min-width: 70px;
    text-align: left;
  }
  &:nth-child(3) {
    text-align: right;
  }
  &:nth-child(4) {
    text-align: right;
    min-width: 100px;
    &:hover {
      & svg {
        color: #ffffff;
      }
    }
  }
  &:nth-child(5) {
    text-align: right;
    min-width: 100px;
  }
  &:nth-child(6) {
    text-align: left;
    min-width: 150px;
  }
  &:nth-child(7) {
    padding: 1.75px 5px;
    min-width: 30px;
    text-align: left;
  }
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;
`

const PTH = css`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: left;
  font-weight: 500;
  position: relative;
  padding: 10px 16px 10px 10px;
`

const PTHC = styled.th`
  ${PTH};
  min-width: 100px;

  &:nth-child(2) {
    min-width: 70px;
    text-align: left;
  }
  &:nth-child(3),
  &:nth-child(4) {
    text-align: right;
  }
`
const PTR = styled.tr`
  cursor: pointer;
  background-color: #393e44;

  &:nth-child(even) {
    background-color: #3a4e4e;
  }
`

const Icon = styled.i`
  padding-right: 5px;
`
