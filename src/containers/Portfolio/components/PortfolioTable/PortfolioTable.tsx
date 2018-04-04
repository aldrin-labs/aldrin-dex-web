import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import Switch from '@components/Switch/Switch'
import ProfileChart from '@containers/Profile/components/ProfileChart'
import filterListIcon from '../../../../icons/filter-list.svg'
import gridLoader from '../../../../icons/grid.svg'
import { RowT, State, Args } from './types'
import { TableProps, Portfolio } from '../../interfaces'
import PortfolioTableIndustries from './PortfolioTableIndustries'
import PortfolioTableRebalance from './PortfolioTableRebalance'
import PortfolioTableBalances from './PortfolioTableBalances'

import { MOCK_DATA } from './dataMock'

const UPDATE_PORTFOLIO = gql`
  mutation updatePortfolio {
    updatePortfolio
  }
`

const defaultSelectedSum = {
  currency: '',
  symbol: '',
  percentage: 0,
  price: 0,
  quantity: 0,
  currentPrice: 0,
  daily: 0,
  dailyPerc: 0,
  realizedPL: 0,
  realizedPLPerc: 0,
  unrealizedPL: 0,
  unrealizedPLPerc: 0,
}

export class PortfolioTable extends React.Component<TableProps> {
  state: State = {
    tableData: null,
    selectedBalances: null,
    selectedSum: defaultSelectedSum,
    currentSort: null,
    isShownChart: false,
    activeKeys: null,
    portfolio: null,
    isUSDCurrently: true,
    tab: 'main',
  }

  componentDidMount() {
    this.setState({ portfolio: MOCK_DATA })
    this.combineTableData(MOCK_DATA)
  }

  componentWillReceiveProps(nextProps: TableProps) {
    if (nextProps.data) {
      const { portfolio } = nextProps.data
      if (!portfolio) return

      // this.setState({ portfolio })
      // this.combineTableData(portfolio)
    }

    if (nextProps.subscription && nextProps.subscription.data) {
      const { portfolio } = nextProps.subscription.data

      // this.setState({ portfolio })
      // this.combineTableData(portfolio)
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.isUSDCurrently !== this.state.isUSDCurrently) {
      this.combineTableData(MOCK_DATA)
    }
  }

  onFloorN = (x: number, n: number) => {
    var mult = Math.pow(10, n)
    return Math.floor(x * mult) / mult
  }

  calcPercentage = (num: number) => {
    return this.onFloorN(num, 2)
  }

  combineTableData = (portfolio?: Portfolio) => {
    const { activeKeys, isUSDCurrently } = this.state
    if (!portfolio || !portfolio.assets || !activeKeys) return
    const { assets } = portfolio

    const allSums = assets.reduce((acc, curr) => {
      return acc + curr.value * curr.asset.priceUSD
    }, 0)

    const tableData = assets
      .map((row) => {
        const {
          asset,
          value,
          key,
          exchange,
          usdRealizedProfit,
          usdUnrealizedProfit,
        } =
          row || {}
        if (activeKeys.indexOf(key.name) === -1) return null
        const { symbol, priceUSD, priceBTC, percentChangeDay } = asset
        const { name } = exchange

        const mainPrice = isUSDCurrently ? priceUSD : priceBTC
        console.log('mainPrice', mainPrice)

        const col = {
          currency: name || '',
          symbol,
          percentage: this.calcPercentage(priceUSD * value / allSums * 100),
          price: mainPrice || 0,
          quantity: value || 0,
          currentPrice: mainPrice * value || 0,
          daily: this.calcPercentage(priceUSD / 100 * percentChangeDay),
          dailyPerc: percentChangeDay,
          realizedPL: usdRealizedProfit,
          realizedPLPerc: 0,
          unrealizedPL: usdUnrealizedProfit,
          unrealizedPLPerc: 0,
        }

        return col
      })
      .filter(Boolean)
    this.setState({ tableData }, () =>
      this.calculateSum(this.state.selectedBalances)
    )
  }

  onSelectAll = () => {
    const { selectedBalances, tableData } = this.state
    if (!tableData) return

    if (selectedBalances && selectedBalances.length === tableData.length) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    } else {
      const allRows = tableData.map((ck, idx) => idx)

      this.setState({ selectedBalances: allRows }, () =>
        this.calculateSum(allRows)
      )
    }
  }

  calculateSum = (selectedRows: number[] | null) => {
    const { tableData } = this.state
    if (!tableData) return

    if (!selectedRows) {
      this.setState({ selectedSum: defaultSelectedSum })
      return
    }

    const sum = tableData.filter((td, idx) => selectedRows.indexOf(idx) >= 0)
    const reducedSum = sum.reduce(
      (acc, val) => {
        return {
          currency: val.currency,
          symbol: val.symbol,
          percentage: acc.percentage + val.percentage,
          price: acc.price + val.price,
          quantity: acc.quantity + val.quantity,
          currentPrice: acc.currentPrice + val.currentPrice,
          daily: acc.daily + val.daily,
          dailyPerc: acc.dailyPerc + val.dailyPerc,
          realizedPL: acc.realizedPL + val.realizedPL,
          realizedPLPerc: acc.realizedPLPerc + val.realizedPLPerc,
          unrealizedPL: acc.unrealizedPL + val.unrealizedPL,
          unrealizedPLPerc: acc.unrealizedPLPerc + val.unrealizedPLPerc,
        }
      },
      {
        currency: '',
        symbol: '',
        percentage: 0,
        price: 0,
        quantity: 0,
        currentPrice: 0,
        daily: 0,
        dailyPerc: 0,
        realizedPL: 0,
        realizedPLPerc: 0,
        unrealizedPL: 0,
        unrealizedPLPerc: 0,
      }
    )
    const validateSum = this.onValidateSum(reducedSum)
    this.setState({ selectedSum: validateSum })
  }

  onValidateSum = (reducedSum: RowT) => {
    const { selectedBalances, tableData } = this.state
    if (!selectedBalances || !tableData) return null
    const clonedSum = { ...reducedSum }

    if (selectedBalances.length === tableData.length) {
      clonedSum.currency = 'All'
      clonedSum.symbol = '-'
    } else if (selectedBalances.length > 1) {
      clonedSum.currency = 'Selected'
      clonedSum.symbol = '-'
    }

    return clonedSum
  }

  onSelectBalance = (index: number) => {
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []

    const hasIndex = selectedBalances.indexOf(index)
    if (hasIndex >= 0) {
      selectedBalances.splice(hasIndex, 1)
    } else {
      selectedBalances.push(index)
    }

    this.setState({ selectedBalances }, () =>
      this.calculateSum(selectedBalances)
    )
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

  onToggleUSDBTC = () => {
    this.setState({ isUSDCurrently: !this.state.isUSDCurrently })
  }

  onChangeTab = (kind: 'main' | 'industry' | 'rebalance') => {
    this.setState({ tab: kind })
  }

  render() {
    const {
      selectedBalances,
      selectedSum,
      tableData,
      isShownChart,
      isUSDCurrently,
      tab,
      currentSort,
    } = this.state

    if (!tableData) return null

    const isSelectAll =
      (selectedBalances && selectedBalances.length === tableData.length) ||
      false

    return (
      <PTWrapper>
        <PTHeadingBlock>
          <TabContainer>
            <Tab
              onClick={() => this.onChangeTab('main')}
              active={tab === 'main'}
            >
              Main
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('rebalance')}
              active={tab === 'rebalance'}
            >
              Rebalance
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('industry')}
              active={tab === 'industry'}
            >
              Industry
            </Tab>
          </TabContainer>
          {tab === 'main' && (
            <ToggleBtn onClick={this.onToggleChart}>
              <SvgIcon src={filterListIcon} width={24} height={24} />
            </ToggleBtn>
          )}
        </PTHeadingBlock>

        <PTHeadingBlock>
          {tab === 'main' && (
            <Switch onClick={this.onToggleUSDBTC} values={['USD', 'BTC']} />
          )}

          <Mutation mutation={UPDATE_PORTFOLIO}>
            {(updatePortfolio, { data, loading }) => {
              return (
                <ToggleBtn onClick={updatePortfolio}>
                  {loading ? (
                    <SvgIcon src={gridLoader} width={24} height={24} />
                  ) : (
                    'Refresh'
                  )}
                </ToggleBtn>
              )
            }}
          </Mutation>
        </PTHeadingBlock>

        {tab === 'rebalance' && (
          <div
            style={{
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <SubHeading>Current portfolio</SubHeading>
            <SubHeading>Rebalanced portfolio</SubHeading>
          </div>
        )}

        {tab === 'rebalance' && <PortfolioTableRebalance />}

        {tab === 'main' && (
          <PortfolioTableBalances
            isUSDCurrently={isUSDCurrently}
            isSelectAll={isSelectAll}
            selectedSum={selectedSum}
            onSelectAll={this.onSelectAll}
            onSortTable={this.onSortTable}
            tableData={tableData}
            selectedBalances={selectedBalances}
            onSelectBalance={this.onSelectBalance}
            currentSort={currentSort}
          />
        )}

        {tab === 'industry' && <PortfolioTableIndustries />}

        {tab === 'main' &&
          isShownChart && (
            <ProfileChart
              style={{ marginLeft: 0, borderTop: '1px solid #fff' }}
            />
          )}
      </PTWrapper>
    )
  }
}

const SubHeading = styled.span`
  font-family: Roboto;
  font-size: 16px;
  color: #fff;
  font-weight: 500;
`

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
  margin: 10px 15px;
  outline: none;
`

const ToggleBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  font-size: 1em;
`

const PTHeading = styled.span`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: #fff;
`

const PTWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 24px;
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
