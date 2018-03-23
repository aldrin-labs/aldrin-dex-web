import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import filterListIcon from '../../../../icons/filter-list.svg'
import selectedIcon from '../../../../icons/selected.svg'
import { tableData } from './mocks'
import { RowT } from './types'

const headings = [
  'Currency',
  'Symbol',
  'Available',
  'Held',
  'Total',
  'Exchange Rate',
  'USD Value',
  'BTC Value',
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

interface TState {
  selectedBalances: number[] | null
  selectedSum: RowT
}

export class PortfolioTable extends React.Component {
  state: TState = {
    selectedBalances: null,
    selectedSum: defaultSelectedSum,
  }

  renderCheckbox = (heading: string, index: number) => {
    const { selectedBalances } = this.state
    const isSelected =
      (selectedBalances && selectedBalances.indexOf(index) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={heading} checked={isSelected} />
        <Label htmlFor={heading} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onSelectAll = () => {
    const { selectedBalances } = this.state

    if (selectedBalances && selectedBalances.length === tableData.length) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    } else {
      const allRows = tableData.map((ck, i) => i)
      const allSums = tableData.reduce((acc, el) => {
        return {
          currency: 'All',
          symbol: '-',
          available: acc.available + el.available,
          held: acc.held + el.held,
          total: acc.total + el.total,
          exhangeRate: 0,
          usdValue: acc.usdValue + el.usdValue,
          btcValue: acc.btcValue + el.btcValue,
        }
      })

      this.setState({ selectedBalances: allRows, selectedSum: allSums })
    }
  }

  setCurrencyAndSymbol = (
    selectedBalances: number[],
    currency: string,
    symbol: string
  ) => {
    if (selectedBalances.length === 0) {
      return {
        currency: '',
        symbol: '',
      }
    }

    if (selectedBalances.length === 1) {
      const idx = selectedBalances[0]
      return {
        currency: tableData[idx].currency,
        symbol: tableData[idx].symbol,
      }
    }

    if (selectedBalances.length > 1) {
      return {
        currency: 'Selected',
        symbol: '-',
      }
    }

    if (selectedBalances.length === tableData.length) {
      return {
        currency: 'All',
        symbol,
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

  onSelectBalance = (index: number, row: RowT) => {
    let selectedSum: RowT | null
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []

    const hasIndex = selectedBalances.indexOf(index)
    if (hasIndex >= 0) {
      selectedSum = this.decrementSelected(this.state.selectedSum, row)

      selectedBalances.splice(hasIndex, 1)
    } else {
      selectedSum = this.incrementSelected(this.state.selectedSum, row)

      selectedBalances.push(index)
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

  render() {
    const { selectedBalances, selectedSum } = this.state
    const isSelectAll =
      (selectedBalances && selectedBalances.length === tableData.length) ||
      false

    return (
      <PTWrapper>
        <PTHeadingBlock>
          <PTHeading>My Balances</PTHeading>
          <SvgIcon src={filterListIcon} width={24} height={24} />
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
              {headings.map((heading) => <PTH key={heading}>{heading}</PTH>)}
            </PTR>
          </PTHead>

          <PTBody>
            {tableData.map((row, i) => {
              const isSelected =
                (selectedBalances && selectedBalances.indexOf(i) >= 0) || false
              const cols = Object.keys(row).map((key) => row[key])
              cols.unshift(this.renderCheckbox(row['currency'], i))

              return (
                <PTR
                  key={row.currency}
                  isSelected={isSelected}
                  onClick={() => this.onSelectBalance(i, row)}
                >
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
      </PTWrapper>
    )
  }
}

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
  padding: 19px 32px;
  font-weight: 500;
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
  width: 1200px;
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
