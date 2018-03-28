import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import ProfileChart from '@containers/Profile/components/ProfileChart'
import filterListIcon from '../../../../icons/filter-list.svg'
import selectedIcon from '../../../../icons/selected.svg'
import sortIcon from '../../../../icons/arrow.svg'
import { tableMocks } from './mocks'
import { RowT, State, Args } from './types'
import { Props } from '../../interfaces'

const headings: Array<{ name: string; value: Args }> = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: '% of Portfolio', value: 'available' },
  { name: 'Price per coin', value: 'held' },
  { name: 'Quantity', value: 'total' },
  { name: 'Current USD', value: 'exchangeRate' },
  { name: 'Current BTC', value: 'usdValue' },
  { name: '24hr change USD', value: 'btcValue' },
  { name: '24hr change BTC', value: 'btcValue' },
  { name: 'USD P&L', value: 'btcValue' },
  { name: 'BTC P&L', value: 'btcValue' },
]

const defaultSelectedSum = {
  currency: '',
  symbol: '',
  available: 0,
  held: 0,
  total: 0,
  exchangeRate: 0,
  usdValue: 0,
  btcValue: 0,
}

export class PortfolioTable extends React.Component<Props> {
  state: State = {
    tableData: tableMocks,
    selectedBalances: null,
    selectedSum: defaultSelectedSum,
    currentSort: null,
    isShownChart: true,
  }

  renderCheckbox = (rowCurrency: string) => {
    const { selectedBalances } = this.state
    const isSelected =
      (selectedBalances && selectedBalances.indexOf(rowCurrency) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={rowCurrency} checked={isSelected} />
        <Label htmlFor={rowCurrency} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onSelectAll = () => {
    const { selectedBalances, tableData } = this.state

    if (selectedBalances && selectedBalances.length === tableData.length) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    } else {
      const allRows = tableData.map((ck) => ck.currency)
      const allSums = tableData.reduce((acc, el) => {
        return {
          currency: 'All',
          symbol: '-',
          available: acc.available + el.available,
          held: acc.held + el.held,
          total: acc.total + el.total,
          exchangeRate: 0,
          usdValue: acc.usdValue + el.usdValue,
          btcValue: acc.btcValue + el.btcValue,
        }
      })

      this.setState({ selectedBalances: allRows, selectedSum: allSums })
    }
  }

  setCurrencyAndSymbol = (
    selectedBalances: string[],
    currency: string,
    symbol: string
  ) => {
    const { tableData } = this.state

    if (selectedBalances.length === 0) {
      return {
        currency: '',
        symbol: '',
      }
    }

    if (selectedBalances.length === 1) {
      let idx = 0

      tableData.forEach((td, i) => {
        if (td.currency === selectedBalances[0]) {
          idx = i
        }
      })

      return {
        currency: tableData[idx].currency,
        symbol: tableData[idx].symbol,
      }
    }

    if (selectedBalances.length === tableData.length) {
      return {
        currency: 'All',
        symbol,
      }
    }

    if (selectedBalances.length > 1) {
      return {
        currency: 'Selected',
        symbol: '-',
      }
    }

    return {
      currency: '',
      symbol: '',
    }
  }

  decrementSelected = (selectedSum: RowT, row: RowT) => {
    const { available, held, total, usdValue, btcValue } = selectedSum
    return {
      currency: row.currency,
      symbol: row.symbol,
      available: available - row.available,
      held: held - row.held,
      total: total - row.total,
      exchangeRate: 0,
      usdValue: usdValue - row.usdValue,
      btcValue: btcValue - row.btcValue,
    }
  }

  incrementSelected = (selectedSum: RowT, row: RowT) => {
    const { available, held, total, usdValue, btcValue } = selectedSum
    return {
      currency: row.currency,
      symbol: row.symbol,
      available: row.available + available,
      held: row.held + held,
      total: row.total + total,
      exchangeRate: 0,
      usdValue: row.usdValue + usdValue,
      btcValue: row.btcValue + btcValue,
    }
  }

  onSelectBalance = (rowCurrency: string, row: RowT) => {
    let selectedSum: RowT | null
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []

    const hasIndex = selectedBalances.indexOf(rowCurrency)
    if (hasIndex >= 0) {
      selectedSum = this.decrementSelected(this.state.selectedSum, row)

      selectedBalances.splice(hasIndex, 1)
    } else {
      selectedSum = this.incrementSelected(this.state.selectedSum, row)

      selectedBalances.push(rowCurrency)
    }

    const { currency, symbol } = this.setCurrencyAndSymbol(
      selectedBalances,
      row.currency,
      row.symbol
    )

    selectedSum.currency = currency
    selectedSum.symbol = symbol

    this.setState({ selectedBalances, selectedSum })
  }

  onSortStrings = (a: string, b: string) => {
    return a.localeCompare(b)
  }

  onSortTable = (key: Args) => {
    const { tableData, currentSort } = this.state

    const newData = tableData.slice().sort((a, b) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { key, arg: 'DESC' } })

          if (key === 'currency' || key === 'symbol') {
            return this.onSortStrings(b[key], a[key])
          }
          return b[key] - a[key]
        } else {
          this.setState({ currentSort: { key, arg: 'ASC' } })

          if (key === 'currency' || key === 'symbol') {
            return this.onSortStrings(a[key], b[key])
          }
          return a[key] - b[key]
        }
      }
      this.setState({ currentSort: { key, arg: 'ASC' } })

      if (key === 'currency' || key === 'symbol') {
        return this.onSortStrings(a[key], b[key])
      }
      return a[key] - b[key]
    })

    this.setState({ tableData: newData })
  }

  onToggleChart = () => {
    this.setState({ isShownChart: !this.state.isShownChart })
  }

  render() {
    const {
      selectedBalances,
      selectedSum,
      tableData,
      currentSort,
      isShownChart,
    } = this.state
    const { data } = this.props
    if (!data) return null
    const { portfolio } = data
    const { assets } = portfolio

    const isSelectAll =
      (selectedBalances && selectedBalances.length === tableData.length) ||
      false

    return (
      <PTWrapper>
        <TabContainer>
          <Tab active>My Balances</Tab>

          <Tab disabled>Rebalance</Tab>

          <Tab disabled>Industries</Tab>
        </TabContainer>

        <PTHeadingBlock>
          <PTHeading>My Balances</PTHeading>
          <ToggleBtn onClick={this.onToggleChart}>
            <SvgIcon src={filterListIcon} width={24} height={24} />
          </ToggleBtn>
        </PTHeadingBlock>

        <PTable>
          <PTHead>
            <PTR>
              <PTH key="selectAll">
                <Checkbox
                  type="checkbox"
                  id="selectAll"
                  checked={isSelectAll}
                  onChange={this.onSelectAll}
                />
                <Label htmlFor="selectAll">
                  <Span />
                </Label>
              </PTH>
              {headings.map((heading) => {
                const isSorted =
                  currentSort && currentSort.key === heading.value
                return (
                  <PTH
                    key={heading.name}
                    onClick={() => this.onSortTable(heading.value)}
                    style={{ paddingRight: isSorted ? null : '20px' }}
                  >
                    {heading.name}
                    {isSorted && (
                      <SvgIcon
                        src={sortIcon}
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
                  </PTH>
                )
              })}
            </PTR>
          </PTHead>

          <PTBody>
            {assets.map((row: RowT, i) => {
              const {
                asset,
                value,
                realizedProfit,
                unrealizedProfit,
                totalProfit,
              } = row
              const isSelected =
                (selectedBalances && selectedBalances.indexOf(symbol) >= 0) ||
                false

              const { name, symbol, priceUSD } = asset
              const cols = []
              cols.push(
                name,
                symbol,
                value,
                realizedProfit,
                unrealizedProfit,
                totalProfit,
                priceUSD,
                priceUSD
              )
              console.log(cols)

              return (
                <PTR
                  key={symbol}
                  isSelected={isSelected}
                  onClick={() => this.onSelectBalance(symbol, row)}
                >
                  <PTD key="smt" isSelected={isSelected}>
                    {this.renderCheckbox(symbol)}
                  </PTD>
                  {cols.map((col, idx) => {
                    return (
                      <PTD key={`${col}${idx}`} isSelected={isSelected}>
                        {col}
                      </PTD>
                    )
                  })}
                </PTR>
              )
            })}
          </PTBody>

          <PTBody style={{ borderBottom: 'none' }}>
            <PTR>
              <PTD>
                <SvgIcon src={selectedIcon} width={24} height={24} />
              </PTD>
              {Object.keys(selectedSum).map((key) => (
                <PTD key={key}>{selectedSum[key]}</PTD>
              ))}
            </PTR>
          </PTBody>
        </PTable>

        {isShownChart && (
          <ProfileChart
            style={{ marginLeft: 0, borderTop: '1px solid #fff' }}
          />
        )}
      </PTWrapper>
    )
  }
}

const TabContainer = styled.div`
  display: flex;
`

const Tab = styled.button`
  color: ${(props: { active?: boolean }) =>
    props.active ? '#4ed8da' : '#fff'};
  border-color: ${(props: { active?: boolean }) =>
    props.active ? '#4ed8da' : 'transparent'};

  padding: 10px 30px;
  border-radius: 3px;
  background-color: #292d31;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  margin: 10px 20px;
  outline: none;
`

const ToggleBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`

const Span = styled.span``

const Label = styled.label``

const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 22px;
    height: 22px;

    cursor: pointer;
    vertical-align: middle;

    border: 1.5px solid #909294;
    border-radius: 3px;
    background-color: transparent;
  }

  & + ${Label}:hover ${Span} {
    border-color: #4ed8da;
  }

  & :checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 20px 32px;
`

const PTH = styled.th`
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  color: #fff;
  padding: 19px 0 19px 32px;
  font-weight: 500;

  position: relative;
`

const PTBody = styled.tbody`
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTHead = styled.thead``

const PTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const PTHeading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: #fff;
`

const PTWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px auto;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
`

const PTHeadingBlock = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`
