import * as React from 'react'
import { formatNumberToUSFormat } from '@utils/PortfolioTableUtils'
import { IProps, IState } from './CurrentPortfolioTable.types'
import { IRow } from '../Rebalance.types'

import { Icon } from '@styles/cssUtils'
import { Table } from '@storybook-components'
import styled from 'styled-components'

export default class CurrentPortfolioTable extends React.Component<
  IProps,
  IState
> {
  transformData = (staticRows, mainSymbol) => {
    const transformedData = staticRows.map((row) => {
      return Object.values({
        exchange: row.exchange,
        coin: { render: row.symbol, style: { fontWeight: 700 } },
        portfolioPerc: { render: `${row.portfolioPerc}%`, isNumber: true },
        price: {
          additionalRender: mainSymbol,
          render: formatNumberToUSFormat(row.price),
          isNumber: true,
        },
      })
    })

    return transformedData
  }

  putDataInTable = () => {
    const { staticRows, isUSDCurrently, totalStaticRows } = this.props
    const { transformData } = this
    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" />
    ) : (
      <Icon className="fa fa-btc" />
    )

    console.log('staticRows', staticRows)

    return {
      head: [
        { render: 'exchange', isNumber: false },
        { render: 'coin', isNumber: false },
        { render: 'portfolio%', isNumber: true },
        { render: isUSDCurrently ? 'usd' : 'btc', isNumber: true },
      ],
      body: transformData(staticRows, mainSymbol),
      footer: [
        ' ',
        ' ',
        { render: '100%', isNumber: true },
        {
          additionalRender: mainSymbol,
          render: formatNumberToUSFormat(totalStaticRows),
          isNumber: true,
        },
      ],
    }
  }

  render() {
    return (
      <TableWrapper>
        <Table
          title="Current portfolio"
          withCheckboxes={false}
          rows={this.putDataInTable()}
        />
      </TableWrapper>
    )
  }
}


const TableWrapper = styled.div`
  width: 50%;
  display: flex;
`


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
