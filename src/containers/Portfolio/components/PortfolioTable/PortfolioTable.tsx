import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import ProfileChart from '@containers/Profile/components/ProfileChart'
import filterListIcon from '../../../../icons/filter-list.svg'
import selectedIcon from '../../../../icons/selected.svg'
import sortIcon from '../../../../icons/arrow.svg'
import { RowT, State, Args } from './types'
import { TableProps, Portfolio } from '../../interfaces'

const headings: Array<{ name: string; value: Args }> = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: '% of Portfolio', value: 'percentage' },
  { name: 'Price per coin', value: 'price' },
  { name: 'Quantity', value: 'quantity' },
  { name: 'Current USD', value: 'priceUSD' },
  { name: 'Current BTC', value: 'priceBTC' },
  { name: '24hr change USD', value: 'usdDaily' },
  { name: '24hr change BTC', value: 'btcDaily' },
  { name: 'USD P&L', value: 'usdpl' },
  { name: 'BTC P&L', value: 'btcpl' },
]

const defaultSelectedSum = {
  currency: '',
  symbol: '',
  percentage: 0,
  price: 0,
  quantity: 0,
  priceUSD: 0,
  priceBTC: 0,
  usdDaily: 0,
  btcDaily: 0,
  usdpl: 0,
  btcpl: 0,
}

export class PortfolioTable extends React.Component<TableProps> {
  state: State = {
    tableData: null,
    selectedBalances: null,
    selectedSum: defaultSelectedSum,
    currentSort: null,
    isShownChart: true,
    activeKeys: null,
  }

  componentWillReceiveProps(nextProps: TableProps) {
    if (nextProps.data) {
      const { portfolio } = nextProps.data
      if (!portfolio) return
      this.setState({ portfolio })
      this.combineTableData(portfolio)
    }

    if (nextProps.subscription && nextProps.subscription.data) {
      const { portfolio } = nextProps.subscription.data

      this.setState({ portfolio })
      this.combineTableData(portfolio)
    }

    if (nextProps.checkboxes) {
      this.setState({ activeKeys: nextProps.checkboxes }, () =>
        this.combineTableData(this.state.portfolio)
      )
    }
  }

  combineTableData = (portfolio: Portfolio) => {
    const { activeKeys } = this.state
    if (!portfolio) return
    const { assets } = portfolio
    if (!assets || !activeKeys) return

    const allSums = assets.reduce((acc, curr) => {
      return acc + curr.value * curr.asset.priceUSD
    }, 0)

    const tableData = assets
      .map((row) => {
        const { asset, value, key } = row || {}
        if (activeKeys.indexOf(key.name) === -1) return null
        const { name, symbol, priceUSD, usdTotalProfit, btcTotalProfit } = asset

        const col = {
          currency: name || '',
          symbol,
          percentage: 0, // make fn
          price: priceUSD || 0,
          quantity: value || 0,
          priceUSD: priceUSD * value || 0,
          priceBTC: 0, // add to query
          usdDaily: 0,
          btcDaily: 0,
          usdpl: usdTotalProfit,
          btcpl: btcTotalProfit,
        }

        return col
      })
      .filter(Boolean)
    this.setState({ tableData })
  }

  renderCheckbox = (rowSymbol: string) => {
    const { selectedBalances } = this.state
    const isSelected =
      (selectedBalances && selectedBalances.indexOf(rowSymbol) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={rowSymbol} checked={isSelected} />
        <Label htmlFor={rowSymbol} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onSelectAll = () => {
    const { selectedBalances, tableData } = this.state
    if (!tableData) return

    if (selectedBalances && selectedBalances.length === tableData.length) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    } else {
      const allRows = tableData.map((ck) => ck.symbol)
      const allSums = tableData.reduce((acc, el) => {
        return {
          currency: 'All',
          symbol: '-',
          percentage: Number(acc.percentage) + Number(el.percentage),
          price: Number(acc.price) + Number(el.price),
          quantity: Number(acc.quantity) + Number(el.quantity),
          priceUSD: Number(acc.priceUSD) + Number(el.priceUSD),
          priceBTC: Number(acc.priceBTC) + Number(el.priceBTC),
          usdDaily: Number(acc.usdDaily) + Number(el.usdDaily),
          btcDaily: Number(acc.btcDaily) + Number(el.btcDaily),
          usdpl: Number(acc.usdpl) + Number(el.usdpl),
          btcpl: Number(acc.btcpl) + Number(el.btcpl),
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
    if (!tableData)
      return {
        currency: '',
        symbol: '',
      }

    if (selectedBalances.length === 0) {
      return {
        currency: '',
        symbol: '',
      }
    }

    if (selectedBalances.length === 1) {
      let idx = 0

      tableData.forEach((td, i) => {
        if (td.symbol === selectedBalances[0]) {
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
    const {
      percentage,
      price,
      quantity,
      priceUSD,
      btcpl,
      priceBTC,
      usdDaily,
      btcDaily,
      usdpl,
    } = selectedSum

    return {
      currency: row.currency,
      symbol: row.symbol,
      percentage: Number(percentage) - Number(row.percentage),
      price: Number(price) - Number(row.price),
      quantity: Number(quantity) - Number(row.quantity),
      priceUSD: Number(priceUSD) - Number(row.priceUSD),
      priceBTC: Number(priceBTC) - Number(row.priceBTC),
      usdDaily: Number(usdDaily) - Number(row.usdDaily),
      btcDaily: Number(btcDaily) - Number(row.btcDaily),
      usdpl: Number(usdpl) - Number(row.usdpl),
      btcpl: Number(btcpl) - Number(row.btcpl),
    }
  }

  incrementSelected = (selectedSum: RowT, row: RowT) => {
    const {
      percentage,
      price,
      quantity,
      priceUSD,
      btcpl,
      priceBTC,
      usdDaily,
      btcDaily,
      usdpl,
    } = selectedSum

    return {
      currency: row.currency,
      symbol: row.symbol,
      percentage: Number(percentage) + Number(row.percentage),
      price: Number(price) + Number(row.price),
      quantity: Number(quantity) + Number(row.quantity),
      priceUSD: Number(priceUSD) + Number(row.priceUSD),
      priceBTC: Number(priceBTC) + Number(row.priceBTC),
      usdDaily: Number(usdDaily) + Number(row.usdDaily),
      btcDaily: Number(btcDaily) + Number(row.btcDaily),
      usdpl: Number(usdpl) + Number(row.usdpl),
      btcpl: Number(btcpl) + Number(row.btcpl),
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

    if (!tableData) return null

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
              <PTH key="selectAll" style={{ textAlign: 'left' }}>
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
                    // style={{ paddingRight: isSorted ? null : '20px' }}
                  >
                    {heading.name}
                    {/*{isSorted && (
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
                    )}*/}
                  </PTH>
                )
              })}
            </PTR>
          </PTHead>

          <PTBody>
            {tableData.map((row) => {
              const {
                currency,
                symbol,
                percentage,
                price,
                quantity,
                priceUSD,
                priceBTC,
                usdDaily,
                btcDaily,
                usdpl,
                btcpl,
              } = row

              const isSelected =
                (selectedBalances && selectedBalances.indexOf(symbol) >= 0) ||
                false

              const cols = [
                currency,
                symbol,
                `${percentage}%`,
                `$${price}`,
                quantity,
                `$${priceUSD}`,
                priceBTC,
                usdDaily,
                btcDaily,
                usdpl,
                btcpl,
              ]

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
  text-align: right;
  padding: 20px;
`

const PTH = styled.th`
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: #fff;
  padding: 20px;
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
  width: 95%;
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
