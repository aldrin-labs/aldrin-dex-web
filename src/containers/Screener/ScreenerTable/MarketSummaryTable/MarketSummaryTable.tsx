import * as React from 'react'
import styled, { css } from 'styled-components'
import {
  IProps,
  IState,
  ICurrentSort,
  IMarketSummaryTableData,
} from './MarketSummaryTable.types'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'
import { tableData } from './mocks'
import { onSortTableFull } from '../../../../utils/PortfolioTableUtils'

// TODO: Think about this
let staticRows = tableData

const tableHeadingsCurrentScreenerTable = [
  { name: 'Rank', value: 'rank' },
  { name: 'Ticker', value: 'ticker' },
  { name: 'Price USD', value: 'priceUSD' },
  { name: 'Price BTC', value: 'priceBTC' },
  { name: 'Market Cap', value: 'marketCap' },
  { name: 'Volume 24 Hr', value: 'volume24' },
  { name: '% 1Hr USD ', value: 'one1hrUSD' },
  { name: '% 1Hr BTC', value: 'one1hrBTC' },
  { name: '% 24 Hr USD', value: 'twentyFour24hrUSD' },
  { name: '% 24 Hr BTC', value: 'twentyFour24hrBTC' },
  { name: '% 7 Days USD', value: 'seven7daysUSD' },
  { name: '% 7 Days BTC', value: 'seven7daysBTC' },
  { name: '% Chg ATH', value: 'chgATH' },
]

// TODO: delete selected stuff in styled components

const arrayOfStringHeadings = ['ticker']

export default class MarketSummaryTable extends React.Component<
  IProps,
  IState
> {
  state: IState = {
    currentSort: null,
  }

  onSortTable = (key: string) => {
    const { currentSort } = this.state

    const {
      newData,
      newCurrentSort,
    }: {
      newData: IMarketSummaryTableData
      newCurrentSort: ICurrentSort
    } = onSortTableFull(key, staticRows, currentSort, arrayOfStringHeadings)

    // TODO: Should be refactored
    staticRows = newData

    this.setState({
      currentSort: newCurrentSort,
    })
  }

  render() {
    const { currentSort } = this.state
    const { searchText } = this.props
    const usdSymbol = <Icon className="fa fa-usd" />

    const btcSymbol = <Icon className="fa fa-btc" />

    return (
      <Container>
        <Wrapper>
          <Table>
            <PTHead>
              <PTR>
                {tableHeadingsCurrentScreenerTable.map((heading) => {
                  const isSorted =
                    currentSort && currentSort.key === heading.value

                  return (
                    <PTHC
                      key={heading.name}
                      onClick={() => this.onSortTable(heading.value)}
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
                              currentSort && currentSort.arg === 'ASC'
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
              {staticRows.map((row, idx) => {
                const {
                  rank,
                  ticker,
                  priceUSD,
                  priceBTC,
                  marketCap,
                  volume24,
                  one1hrUSD,
                  one1hrBTC,
                  twentyFour24hrUSD,
                  twentyFour24hrBTC,
                  seven7daysUSD,
                  seven7daysBTC,
                  chgATH,
                } = row

                const cols = [
                  rank,
                  ticker,
                  priceUSD,
                  priceBTC,
                  marketCap,
                  volume24,
                  `${one1hrUSD}%`,
                  `${one1hrBTC}%`,
                  `${twentyFour24hrUSD}%`,
                  `${twentyFour24hrBTC}%`,
                  `${seven7daysUSD}%`,
                  `${seven7daysBTC}%`,
                  `${chgATH}%`,
                ]

                if (
                  searchText &&
                  ticker
                    .toLocaleLowerCase()
                    .indexOf(searchText.toLocaleLowerCase()) === -1
                ) {
                  return
                }

                return (
                  <PTR key={`${rank}${ticker}${idx}`}>
                    {cols.map((col, index) => {
                      if (String(col).match(/%/g)) {
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

                      if (index === 2 || index === 4 || index === 5) {
                        return (
                          <PTDC key={`${col}${idx}`}>
                            {usdSymbol}
                            {col}
                          </PTDC>
                        )
                      }

                      if (index === 3) {
                        return (
                          <PTDC key={`${col}${idx}`}>
                            {btcSymbol}
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
          </Table>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  justify-content: center;

  padding: 20px;
`

const Wrapper = styled.div`
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`
const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const PT = css`
  display: table;
  width: 100%;
  position: sticky;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`

const PTH = css`
  font-family: Roboto;
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

  &:nth-child(1) {
    min-width: 70px;
  }
  
  &:nth-child(2) {
    min-width: 76px;
  }

  &:nth-child(n + 4) {
    min-width: 110px;
  }
  
  &:nth-child(6) {
    min-width: 116px;
  }

  &:nth-child(11),
  &:nth-child(12) {
    min-width: 116px;
  }
`

const PTHead = styled.thead`
  ${PT};
  top: 0;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};

  &:nth-child(even) {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }
`

const PTD = css`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;

  & svg {
    width: 15px;
    height: 15px;
  }
`
const PTDC = styled.td`
  ${PTD};
  min-width: 100px;

  &:nth-child(1) {
    min-width: 70px;
  }
  &:nth-child(2) {
    min-width: 76px;
  }

  &:nth-child(n + 4) {
    min-width: 110px;
  }
  
  &:nth-child(6) {
    min-width: 116px;
  }
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;
`
const Icon = styled.i`
  padding-right: 5px;
`
