import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import Switch from '@components/Switch/Switch'
import PieChart from '@components/PieChart'
import ProfileChart from '@containers/Profile/components/ProfileChart'
import filterListIcon from '../../../../icons/filter-list.svg'
import gridLoader from '../../../../icons/grid.svg'
import spinLoader from '../../../../icons/tail-spin.svg'
import { RowT, State, Args } from './types'
import { TableProps, Portfolio } from '../../interfaces'
import PortfolioTableIndustries from './Industry/PortfolioTableIndustries'
import PortfolioTableRebalance from './Rebalance/PortfolioTableRebalance'
import PortfolioTableBalances from './Main/PortfolioTableBalances'
import Correlation from './Correlation/Correlation'

import { MOCK_DATA } from './dataMock'
import { combineToChart } from './Industry/mocks'

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
    isShownChart: true,
    activeKeys: null,
    portfolio: null,
    isUSDCurrently: true,
    tab: 'main',
  }

  componentDidMount() {
    const { data } = this.props
    if (!data) {
      const portfolio = { assets: MOCK_DATA }
      this.setState({ portfolio })
      this.combineTableData(portfolio)
    }
  }

  componentWillReceiveProps(nextProps: TableProps) {
    if (nextProps.data) {
      const { portfolio } = nextProps.data
      if (!portfolio) return
      const composeWithMocks = {
        ...portfolio,
        assets: portfolio.assets.concat(MOCK_DATA),
      }

      this.setState({ portfolio: composeWithMocks })
      this.combineTableData(composeWithMocks)
    }

    if (nextProps.subscription && nextProps.subscription.data) {
      const portfolio = Object.assign(
        this.state.portfolio,
        JSON.parse(nextProps.subscription.data.portfolioUpdate)
      )
      const composeWithMocks = {
        ...portfolio,
        assets: portfolio.assets.concat(MOCK_DATA),
      }
      this.setState({ portfolio: composeWithMocks })
      this.combineTableData(composeWithMocks)
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
      const { portfolio } = this.state
      this.combineTableData(portfolio)
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

    const allSums = assets.filter(Boolean).reduce((acc, curr) => {
      const { value = 0, asset = { priceUSD: 0 } } = curr || {}
      if (!value || !asset || !asset.priceUSD || !asset.priceBTC) return null
      const price = isUSDCurrently ? asset.priceUSD : asset.priceBTC
      return acc + value * Number(price)
    }, 0)

    const tableData = assets
      .map((row) => {
        const {
          asset = { symbol: '', priceUSD: 0, priceBTC: 0, percentChangeDay: 0 },
          value = 0,
          key = { name: '' },
          exchange = '',
          usdRealizedProfit = 0,
          btcRealizedProfit = 0,
          usdUnrealizedProfit = 0,
          btcUnrealizedProfit = 0,
        } =
          row || {}
        if (activeKeys.indexOf(key.name) === -1) return null
        const { symbol, priceUSD, priceBTC, percentChangeDay } = asset || {}
        const { name } = exchange

        const mainPrice = isUSDCurrently ? priceUSD : priceBTC
        const realizedProfit = isUSDCurrently
          ? usdRealizedProfit
          : btcRealizedProfit
        const unrealizedProfit = isUSDCurrently
          ? usdUnrealizedProfit
          : btcUnrealizedProfit

        const currentPrice = mainPrice * value
        const col = {
          currency: name || '',
          symbol,
          percentage: this.calcPercentage(currentPrice / allSums * 100),
          price: mainPrice || 0,
          quantity: value || 0,
          currentPrice: currentPrice || 0,
          daily: this.calcPercentage(mainPrice / 100 * percentChangeDay),
          dailyPerc: percentChangeDay,
          realizedPL: realizedProfit + currentPrice + unrealizedProfit,
          realizedPLPerc: 0,
          unrealizedPL: unrealizedProfit + currentPrice,
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
          percentage: Number(acc.percentage) + Number(val.percentage),
          price: '',
          quantity: '',
          currentPrice: Number(acc.currentPrice) + Number(val.currentPrice),
          // daily: Number(acc.daily) + Number(val.daily),
          // dailyPerc: Number(acc.dailyPerc) + Number(val.dailyPerc),
          realizedPL: Number(acc.realizedPL) + Number(val.realizedPL),
          // realizedPLPerc:
          //   Number(acc.realizedPLPerc) + Number(val.realizedPLPerc),
          unrealizedPL: Number(acc.unrealizedPL) + Number(val.unrealizedPL),
          // unrealizedPLPerc:
          //   Number(acc.unrealizedPLPerc) + Number(val.unrealizedPLPerc),
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
    console.log('validateSum: ', validateSum)
    this.setState({ selectedSum: validateSum })
  }

  onValidateSum = (reducedSum: RowT) => {
    const { selectedBalances, tableData, isUSDCurrently } = this.state
    if (!selectedBalances || !tableData) return null
    const clonedSum = { ...reducedSum }

    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" key="usd" />
    ) : (
      <Icon className="fa fa-btc" key="btc" />
    )

    if (selectedBalances.length === tableData.length) {
      clonedSum.currency = 'All'
      clonedSum.symbol = '-'
      clonedSum.percentage = 100
    } else if (selectedBalances.length > 1) {
      clonedSum.currency = 'Selected'
      clonedSum.symbol = '-'
    }
    clonedSum.percentage = `${this.calcPercentage(clonedSum.percentage)}%`
    clonedSum.currentPrice = [mainSymbol, clonedSum.currentPrice]
    console.log('clonedSum.currentPrice', clonedSum.currentPrice)

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

    const stringKey =
      key === 'currency' || key === 'symbol' || key === 'industry'

    const newData = tableData.slice().sort((a, b) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { key, arg: 'DESC' } })

          if (stringKey) {
            return this.onSortStrings(b[key], a[key])
          }
          return b[key] - a[key]
        } else {
          this.setState({ currentSort: { key, arg: 'ASC' } })

          if (stringKey) {
            return this.onSortStrings(a[key], b[key])
          }
          return a[key] - b[key]
        }
      }
      this.setState({ currentSort: { key, arg: 'ASC' } })

      if (stringKey) {
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
      tab,
      tableData,
      portfolio,
      selectedSum,
      currentSort,
      isShownChart,
      isUSDCurrently,
      selectedBalances,
    } = this.state

    // if (!this.props.data) return null

    if (this.props.data && !tableData) {
      return (
        <LoaderWrapper>
          <SvgIcon
            src={spinLoader}
            width={48}
            height={48}
            style={{
              position: 'absolute',
              left: 'calc(50% - 48px)',
              top: 'calc(50% - 48px)',
            }}
          />
        </LoaderWrapper>
      )
    }

    const isSelectAll =
      (tableData &&
        selectedBalances &&
        selectedBalances.length === tableData.length) ||
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
              onClick={() => this.onChangeTab('industry')}
              active={tab === 'industry'}
            >
              Industry
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('rebalance')}
              active={tab === 'rebalance'}
            >
              Rebalance
            </Tab>

            <Tab
              onClick={() => this.onChangeTab('correlation')}
              active={tab === 'correlation'}
            >
              Correlation
            </Tab>
          </TabContainer>
          <ToggleBtn onClick={this.onToggleChart}>
            <SvgIcon src={filterListIcon} width={24} height={24} />
          </ToggleBtn>
        </PTHeadingBlock>

        <PTHeadingBlock>
          {tab !== 'correlation' && (
            <Switch onClick={this.onToggleUSDBTC} values={['USD', 'BTC']} />
          )}

          {tab === 'main' && (
            <Mutation mutation={UPDATE_PORTFOLIO}>
              {(updatePortfolio, { data, loading }) => {
                const isLoading = loading || (portfolio && portfolio.processing)
                return (
                  <ToggleBtn onClick={updatePortfolio}>
                    {isLoading ? (
                      <SvgIcon src={gridLoader} width={24} height={24} />
                    ) : (
                      'Refresh'
                    )}
                  </ToggleBtn>
                )
              }}
            </Mutation>
          )}
        </PTHeadingBlock>

        {tab === 'main' && (
          <PortfolioTableBalances
            isShownChart={isShownChart}
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

        {tab === 'industry' && (
          <PortfolioTableIndustries
            checkboxes={this.props.checkboxes}
            data={this.props.data}
            isUSDCurrently={isUSDCurrently}
            onSortTable={this.onSortTable}
          />
        )}

        {tab === 'rebalance' && <PortfolioTableRebalance />}

        {tab === 'correlation' && <Correlation />}

        {tab === 'main' &&
          isShownChart && (
            <ProfileChart
              style={{
                marginLeft: 0,
                borderTop: '1px solid #fff',
                minHeight: '30vh',
              }}
            />
          )}

        {tab === 'industry' && (
          <PieChartContainer>
            <PieChart data={combineToChart()} />
          </PieChartContainer>
        )}
      </PTWrapper>
    )
  }
}

const PieChartContainer = styled.div`
  margin: 50px 10px;
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

const PTWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
`

const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 24px;
  position: relative;
`

const PTHeadingBlock = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 17px;
`
const Icon = styled.i`
  padding-right: 5px;
`
