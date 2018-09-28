import * as React from 'react'
import ArrowDownward from '@material-ui/icons/ArrowDownward'

import { formatNumberToUSFormat } from '@utils/PortfolioTableUtils'
import { IRow } from '../Rebalance.types'
import { IProps, IState } from './CurrentPortfolioTable.types'

import { Wrapper, Table, TableHeading } from '../sharedStyles/sharedStyles'
import { TableAndHeadingWrapper, PTHead, PTFoot, PTDC, PTBody, PTHC, PTR } from './CurrentPortfolioTable.styles'
import { Icon } from '@styles/cssUtils'

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

export default class CurrentPortfolioTable extends React.Component<
  IProps,
  IState
> {
  render() {
    const {
      isUSDCurrently,
      currentSortForStatic,
      totalStaticRows,
      staticRows,
      filterValueSmallerThenPercentage,
      onSortTable,
      theme: { palette }
    } = this.props

    const textColor = palette.getContrastText(
      palette.background.paper
    )
    const background = palette.background.paper
    const secondary = palette.secondary.main
    const evenBackground = palette.action.hover
    const red = palette.red.main
    const green = palette.green.main


    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" />
    ) : (
      <Icon className="fa fa-btc" />
    )

    const tableHeadingsCurrentPortfolio = isUSDCurrently
      ? usdHeadingForCurrent
      : btcHeadingForCurrent

    return (
      <TableAndHeadingWrapper textColor={textColor}>
        <TableHeading>Current portfolio</TableHeading>
        <Wrapper>
          <Table style={{ width: '520px' }}>
            <PTHead bottomCollor={textColor}>
              <PTR
                  background={background}              >
                {tableHeadingsCurrentPortfolio.map((heading) => {
                  const isSorted =
                    currentSortForStatic &&
                    currentSortForStatic.key === heading.value

                  return (
                    <PTHC
                      key={heading.name}
                      onClick={() =>
                        onSortTable(heading.value, 'currentSortForStatic')
                      }
                    >
                      {heading.name}

                      {isSorted && (
                        <ArrowDownward
                          style={{
                            fontSize: 16,
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
                    <PTR 
                      key={`${exchange}${symbol}${idx}`}
                      background={background}
                      evenBackground={evenBackground}
                    >
                      {cols.map((col, index) => {
                        if (col.match(/%/g)) {
                          const color =
                            Number(col.replace(/%/g, '')) >= 0
                              ? green
                              : red

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
