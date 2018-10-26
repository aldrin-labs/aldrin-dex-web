import * as React from 'react'
import ArrowDownward from '@material-ui/icons/ArrowDownward'

import { formatNumberToUSFormat } from '@utils/PortfolioTableUtils'
import { IRow } from '../Rebalance.types'
import { IProps, IState } from './CurrentPortfolioTable.types'

// import { Wrapper, Table, TableHeading } from '../sharedStyles/sharedStyles'
import {
  TableAndHeadingWrapper,
  PTHead,
  PTFoot,
  PTDC,
  PTBody,
  PTHC,
  PTR,
} from './CurrentPortfolioTable.styles'
import { Icon } from '@styles/cssUtils'
import { Table } from '@storybook-components'

// const usdHeadingForCurrent = [
//   { name: 'Exchange', value: 'exchange' },
//   { name: 'Coin', value: 'symbol' },
//   { name: 'Portfolio %', value: 'portfolioPerc' },
//   { name: 'USD', value: 'price' },
// ]

// const btcHeadingForCurrent = [
//   { name: 'Exchange', value: 'exchange' },
//   { name: 'Coin', value: 'symbol' },
//   { name: 'Portfolio %', value: 'portfolioPerc' },
//   { name: 'BTC', value: 'price' },
// ]

export default class CurrentPortfolioTable extends React.Component<
  IProps,
  IState
> {
  transformData = (staticRows) => {
    const transformedData = staticRows.map((row) => {
      return Object.values({
        exchange: row.exchange,
        coin: { render: row.symbol, style: { fontWeight: 700 } },
        portfolioPerc: { render: `${row.portfolioPerc}%`, isNumber: true },
        price: { render: `$ ${row.price}`, isNumber: true },
      })
    })

    return transformedData
  }

  putDataInTable = () => {
    // const { theme, isUSDCurrently } = this.props
    // const { tableData } = this.state
    const { staticRows, isUSDCurrently, totalStaticRows } = this.props
    const { transformData } = this

    console.log('staticRows', staticRows)

    return {
      head: [
        { render: 'exchange', isNumber: false },
        { render: 'coin', isNumber: false },
        { render: 'portfolio%', isNumber: true },
        { render: isUSDCurrently ? 'usd' : 'btc', isNumber: true },
      ],
      body: transformData(staticRows),
      footer: [' ', ' ', {render: '100%', isNumber: true }, {render: `$ ${totalStaticRows}`, isNumber: true }],
    }
  }

  render() {
    const {
      isUSDCurrently,
      currentSortForStatic,
      totalStaticRows,
      staticRows,
      filterValueSmallerThenPercentage,
      onSortTable,
      theme: { palette },
    } = this.props

    const textColor = palette.getContrastText(palette.background.paper)
    const background = palette.background.paper
    const evenBackground = palette.action.hover

    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" />
    ) : (
      <Icon className="fa fa-btc" />
    )

    const tableHeadingsCurrentPortfolio = isUSDCurrently
      ? usdHeadingForCurrent
      : btcHeadingForCurrent

    return (
      <Table
        title="Current portfolio"
        withCheckboxes={false}
        rows={this.putDataInTable()}
      />
    )
  }
}

{
  /*<TableAndHeadingWrapper textColor={textColor}>*/
}
{
  /*<TableHeading>Current portfolio</TableHeading>*/
}
{
  /*<Wrapper>*/
}
{
  /*<Table style={{ width: '520px' }}>*/
}
{
  /*<PTHead bottomCollor={textColor}>*/
}
{
  /*<PTR*/
}
{
  /*background={background}              >*/
}
{
  /*{tableHeadingsCurrentPortfolio.map((heading) => {*/
}
{
  /*const isSorted =*/
}
{
  /*currentSortForStatic &&*/
}
{
  /*currentSortForStatic.key === heading.value*/
}

{
  /*return (*/
}
{
  /*<PTHC*/
}
{
  /*key={heading.name}*/
}
{
  /*onClick={() =>*/
}
{
  /*onSortTable(heading.value, 'currentSortForStatic')*/
}
{
  /*}*/
}
{
  /*>*/
}
{
  /*{heading.name}*/
}

{
  /*{isSorted && (*/
}
{
  /*<ArrowDownward*/
}
{
  /*style={{*/
}
{
  /*fontSize: 16,*/
}
{
  /*verticalAlign: 'middle',*/
}
{
  /*marginLeft: '4px',*/
}
{
  /*transform:*/
}
{
  /*currentSortForStatic &&*/
}
{
  /*currentSortForStatic.arg === 'ASC'*/
}
{
  /*? 'rotate(180deg)'*/
}
{
  /*: null,*/
}
{
  /*}}*/
}
{
  /*/>*/
}
{
  /*)}*/
}
{
  /*</PTHC>*/
}
{
  /*)*/
}
{
  /*})}*/
}
{
  /*</PTR>*/
}
{
  /*</PTHead>*/
}

{
  /*<PTBody>*/
}
{
  /*{staticRows*/
}
{
  /*.filter(*/
}
{
  /*(row: IRow) =>*/
}
{
  /*row.portfolioPerc &&*/
}
{
  /*+row.portfolioPerc >*/
}
{
  /*(filterValueSmallerThenPercentage*/
}
{
  /*? filterValueSmallerThenPercentage*/
}
{
  /*: 0)*/
}
{
  /*)*/
}
{
  /*.map((row: IRow, idx: number) => {*/
}
{
  /*const { exchange = '', symbol = '', portfolioPerc = 0, price = 0 } = row*/
}

{
  /*const cols = [*/
}
{
  /*exchange,*/
}
{
  /*symbol || '',*/
}
{
  /*portfolioPerc ? `${portfolioPerc}%` : '',*/
}
{
  /*`${formatNumberToUSFormat(price)}`,*/
}
{
  /*]*/
}

{
  /*return (*/
}
{
  /*<PTR*/
}
{
  /*key={`${exchange}${symbol}${idx}`}*/
}
{
  /*background={background}*/
}
{
  /*evenBackground={evenBackground}*/
}
{
  /*>*/
}
{
  /*{cols.map((col, index) => {*/
}
{
  /*if (col.match(/%/g)) {*/
}
{
  /*return (*/
}
{
  /*<PTDC key={`${col}${index}`}>*/
}
{
  /*{col}*/
}
{
  /*</PTDC>*/
}
{
  /*)*/
}
{
  /*}*/
}
{
  /*if (index === 3) {*/
}
{
  /*return (*/
}
{
  /*<PTDC key={`${col}${idx}`}>*/
}
{
  /*{mainSymbol}*/
}
{
  /*{col}*/
}
{
  /*</PTDC>*/
}
{
  /*)*/
}
{
  /*}*/
}

{
  /*return <PTDC key={`${col}${index}`}>{col}</PTDC>*/
}
{
  /*})}*/
}
{
  /*</PTR>*/
}
{
  /*)*/
}
{
  /*})}*/
}
{
  /*</PTBody>*/
}
{
  /*<PTFoot>*/
}
{
  /*<PTR*/
}
{
  /*background={background}*/
}
{
  /*evenBackground={background}*/
}
{
  /*>*/
}
{
  /*<PTHC>All</PTHC>*/
}
{
  /*<PTHC>-</PTHC>*/
}
{
  /*<PTHC>100%</PTHC>*/
}
{
  /*<PTHC>*/
}
{
  /*{mainSymbol}*/
}
{
  /*{formatNumberToUSFormat(totalStaticRows)}*/
}
{
  /*</PTHC>*/
}
{
  /*</PTR>*/
}
{
  /*</PTFoot>*/
}
{
  /*</Table>*/
}
{
  /*</Wrapper>*/
}
{
  /*</TableAndHeadingWrapper>*/
}
