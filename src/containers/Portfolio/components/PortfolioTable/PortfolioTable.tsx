import * as React from 'react'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import ProfileChart from '@containers/Profile/components/ProfileChart'
import filterListIcon from '../../../../icons/filter-list.svg'
import { RowT, State, Args } from './types'
import { TableProps, Portfolio } from '../../interfaces'
import PortfolioTableMain from './PortfolioTableMain'
import PortfolioTableSum from './PortfolioTableSum'
import PortfolioTableHead from './PortfolioTableHead'

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
    portfolio: null,
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

    if (nextProps.checkboxes && nextProps.checkboxes.length === 0) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    }
  }

  combineTableData = (portfolio?: Portfolio) => {
    const { activeKeys } = this.state
    if (!portfolio || !portfolio.assets || !activeKeys) return
    const { assets } = portfolio

    // const allSums = assets.reduce((acc, curr) => {
    //   return acc + curr.value * curr.asset.priceUSD
    // }, 0)

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
          usdpl: usdTotalProfit || 0,
          btcpl: btcTotalProfit || 0,
        }

        return col
      })
      .filter(Boolean)
    this.setState({ tableData })
  }

  onSelectAll = () => {
    const { selectedBalances, tableData } = this.state
    if (!tableData) return

    if (selectedBalances && selectedBalances.length === tableData.length) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    } else {
      const startAcc = {
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
      }, startAcc)

      this.setState({ selectedBalances: allRows, selectedSum: allSums })
    }
  }

  setCurrencyAndSymbol = (
    selectedBalances: string[],
    currency: string,
    symbol: string
  ): { currency: string; symbol: string } => {
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

  decrementSelected = (selectedSum: RowT, row: RowT): RowT => {
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

  incrementSelected = (selectedSum: RowT, row: RowT): RowT => {
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

  onSortStrings = (a: string, b: string): number => {
    return a.localeCompare(b)
  }

  onSortTable = (key: Args) => {
    const { tableData, currentSort } = this.state
    if (!tableData) return

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
          <PortfolioTableHead
            isSelectAll={isSelectAll}
            onSelectAll={this.onSelectAll}
            onSortTable={this.onSortTable}
          />

          <PortfolioTableMain
            tableData={tableData}
            selectedBalances={selectedBalances}
            onSelectBalance={this.onSelectBalance}
          />

          <PortfolioTableSum selectedSum={selectedSum} />
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
