import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { Typography, Divider, Button } from '@material-ui/core'
import AddIcon from 'material-ui-icons/Add'
import { Link } from 'react-router-dom'

import { getPortfolioQuery } from '@containers/Portfolio/api'
import QueryRenderer from '@components/QueryRenderer'
import PortfolioTableMain from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableMain'
import PortfolioTableSum from '@containers/Portfolio/components/PortfolioTable/PortfolioTableSum'
import PortfolioTableHead from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableHead'
import {
  onValidateSum,
  onSortStrings,
  roundPercentage,
  calcAllSumOfPortfolioAsset,
} from '@utils/PortfolioTableUtils'
import * as actions from '@containers/Portfolio/actions'
import Chart from '@containers/Portfolio/components/GQLChart'
import { MOCK_DATA } from '@containers/Portfolio/components/PortfolioTable/dataMock'
import { Args } from '@containers/Portfolio/components/PortfolioTable/types'
import { IPortfolio } from '@containers/Portfolio/interfaces'
import {
  IProps,
  IState,
} from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances.types'
import TradeOrderHistoryTable from '@containers/Portfolio/components/PortfolioTable/Main/TradeOrderHistory/TradeOrderHistoryTable'
import { customAquaScrollBar } from '@utils/cssUtils'
import { withRouter } from 'react-router'

const MyLinkToUserSettings = props => <Link to="/user" {...props} />


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
  totalPL: 0,
}

class PortfolioTableBalances extends React.Component<IProps, IState> {
  state: IState = {
    tableData: null,
    selectedBalances: null,
    selectedSum: defaultSelectedSum,
    currentSort: null,
    activeKeys: null,
    activeWallets: null,
    portfolio: null,
  }

  componentDidMount() {
    const {
      data: { getProfile: data },
      isShownMocks,
      switchToUsd,
    } = this.props

    switchToUsd()

    if (!data && isShownMocks) {
      this.setState({ portfolio: { assets: MOCK_DATA } }, () =>
        this.combineTableData({ assets: MOCK_DATA })
      )

      this.setState({ activeKeys: this.props.checkboxes })

      return
    } else if (!data) {
      return
    }
    const { portfolio } = data

    const composeWithMocks = isShownMocks
      ? {
        ...portfolio,
        assets: portfolio.assets.concat(MOCK_DATA),
        cryptoWallets: portfolio.cryptoWallets.concat([])
      }
      : portfolio

    this.setState({ portfolio: composeWithMocks }, () =>
      this.combineTableData(composeWithMocks)
    )

    this.setState({ activeKeys: this.props.checkboxes })
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.data) {
      const { portfolio } = nextProps.data.getProfile

      if (!portfolio || portfolio === null) {
        return
      }

      const composeWithMocks = nextProps.isShownMocks
        ? {
          ...portfolio,
          assets: portfolio!.assets!.concat(MOCK_DATA),
          cryptoWallets: portfolio!.cryptoWallets!.concat([])
        }
        : portfolio

      this.setState({ portfolio: composeWithMocks })
      this.combineTableData(composeWithMocks)
    }

    if (nextProps.subscription && nextProps.subscription.data) {
      const portfolio = Object.assign(
        this.state.portfolio,
        JSON.parse(nextProps.subscription.data.portfolioUpdate)
      )
      const composeWithMocks = nextProps.isShownMocks
        ? {
          ...portfolio,
          assets: portfolio.assets.concat(MOCK_DATA),
          cryptoWallets: portfolio.cryptoWallets.concat([])
        }
        : portfolio

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

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevProps.isUSDCurrently !== this.props.isUSDCurrently) {
      const { portfolio } = this.state
      this.combineTableData(portfolio)
    }
  }

  combineTableData = (portfolio?: IPortfolio | null) => {
    const { activeKeys, activeCryptoWallets } = this.state
    const { isUSDCurrently, filterValueSmallerThenPercentage } = this.props
    if (!portfolio || !portfolio.assets || !activeKeys) {
      return
    }
    const { assets, cryptoWallets } = portfolio
    const allSums = calcAllSumOfPortfolioAsset(assets, isUSDCurrently, cryptoWallets)
    const walletData = cryptoWallets.map((row: InewRowT) => {

      const {
        baseAsset = { symbol: '', priceUSD: 0, priceBTC: 0, percentChangeDay: 0 },
        name = '',
        address = '',
        assets = [],
      } =
        row || {}
      // if (activeWallets.indexOf(cryptoWallet.name) === -1) {
      //   return null
      // }
      const { symbol, priceUSD, priceBTC } = baseAsset || {}
      // console.log(row);
      // console.log(baseAsset);
      return assets.map((walletAsset: any) => {
        const mainPrice = isUSDCurrently ? walletAsset.asset.priceUSD : walletAsset.asset.priceBTC

        const currentPrice = mainPrice * walletAsset.balance
        const col = {
          currency: (baseAsset.symbol + ' ' + name) || '',
          symbol: walletAsset.asset.symbol,
          percentage: roundPercentage(currentPrice * 100 / allSums),
          price: mainPrice || 0,
          quantity: Number((walletAsset.balance).toFixed(5)) || 0,
          daily: 0,
          dailyPerc: 0,
          currentPrice: currentPrice || 0,
          realizedPL: 0,
          realizedPLPerc: 0,
          unrealizedPL: 0,
          unrealizedPLPerc: 0,
          totalPL: 0,
        }

        return col
      })
    }).reduce((a: any, b: any) => a.concat(b), []);


    const tableData = [assets
      .map((row: InewRowT, i) => {
        const {
          asset = { symbol: '', priceUSD: 0, priceBTC: 0, percentChangeDay: 0 },
          value = 0,
          key = { name: '' },
          exchange = '',
          usdRealizedProfit = 0,
          btcRealizedProfit = 0,
          usdUnrealizedProfit = 0,
          btcUnrealizedProfit = 0,
          usdTotalProfit = 0,
          btcTotalProfit = 0,
        } =
          row || {}
        if (activeKeys.indexOf(key.name) === -1) {
          return null
        }
        const { symbol, priceUSD, priceBTC, percentChangeDay } = asset || {}
        const { name } = exchange

        const mainPrice = isUSDCurrently ? priceUSD : priceBTC
        const realizedProfit = isUSDCurrently
          ? usdRealizedProfit
          : btcRealizedProfit
        const unrealizedProfit = isUSDCurrently
          ? usdUnrealizedProfit
          : btcUnrealizedProfit
        const totalProfit = isUSDCurrently ? usdTotalProfit : btcTotalProfit

        const currentPrice = mainPrice * value
        const col = {
          id: i,
          currency: name || '',
          symbol,
          percentage: roundPercentage(currentPrice * 100 / allSums),
          price: mainPrice || 0,
          quantity: value || 0,
          currentPrice: currentPrice || 0,
          daily: roundPercentage(mainPrice / 100 * percentChangeDay),
          dailyPerc: percentChangeDay,
          realizedPL: realizedProfit,
          realizedPLPerc: 0,
          unrealizedPL: unrealizedProfit,
          unrealizedPLPerc: 0,
          totalPL: realizedProfit + unrealizedProfit,
        }

        return col
      }), walletData].reduce((a: any, b: any) => a.concat(b), [])
      .filter(Boolean)
      .filter(
        (el) =>
          el.percentage >
          (filterValueSmallerThenPercentage
            ? filterValueSmallerThenPercentage
            : 0)
      )

    const selectAllLinesInTable = tableData.map((_, i) => i)

    this.setState({ tableData, selectedBalances: selectAllLinesInTable }, () =>
      this.calculateSum(this.state.selectedBalances)
    )
  }

  onSelectAll = () => {
    const { selectedBalances, tableData } = this.state
    if (!tableData) {
      return
    }

    if (selectedBalances && selectedBalances.length === tableData.length) {
      this.setState({ selectedBalances: null, selectedSum: defaultSelectedSum })
    } else {
      const allRows = tableData.map((ck: IRowT, idx: number) => idx)

      this.setState({ selectedBalances: allRows }, () =>
        this.calculateSum(allRows)
      )
    }
  }

  calculateSum = (selectedRows: number[] | null) => {
    const { tableData } = this.state
    if (!tableData) {
      return
    }

    if (!selectedRows) {
      this.setState({ selectedSum: defaultSelectedSum })

      return
    }

    const sum = selectedRows.map((idx) => tableData[idx])
    const reducedSum = sum.reduce(
      (acc: any, val: IRowT) => ({
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
        totalPL: Number(acc.totalPL) + Number(val.totalPL),
        // unrealizedPLPerc:
        //   Number(acc.unrealizedPLPerc) + Number(val.unrealizedPLPerc),
      }),
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
        totalPL: 0,
      }
    )
    const { selectedBalances } = this.state
    const { isUSDCurrently } = this.props

    const validateSum = onValidateSum(
      reducedSum,
      selectedBalances,
      tableData,
      isUSDCurrently
    )

    this.setState({ selectedSum: validateSum })
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

  onSortTable = (key: Args) => {
    const { tableData, currentSort } = this.state
    if (!tableData) {
      return
    }

    const stringKey =
      key === 'currency' || key === 'symbol' || key === 'industry'

    const newData = tableData!.slice()!.sort((a, b) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { key, arg: 'DESC' } })

          if (stringKey) {
            return onSortStrings(b[key], a[key])
          }

          return b[key] - a[key]
        } else {
          this.setState({ currentSort: { key, arg: 'ASC' } })

          if (stringKey) {
            return onSortStrings(a[key], b[key])
          }

          return a[key] - b[key]
        }
      }
      this.setState({ currentSort: { key, arg: 'ASC' } })

      if (stringKey) {
        return onSortStrings(a[key], b[key])
      }

      return a[key] - b[key]
    })

    this.setState({ tableData: newData })
  }

  render() {
    const { isShownChart, isUSDCurrently, children, classes } = this.props
    const { selectedSum, currentSort, tableData, selectedBalances } = this.state

    const isSelectAll =
      (tableData &&
        selectedBalances &&
        selectedBalances.length === tableData.length) ||
      false

    const tableDataHasData = tableData ? Object.keys(tableData).length : false

    if (!tableDataHasData) {
      return (
        <PTWrapper tableData={tableDataHasData}>
          <PTextBox>
            <Typography className={classes.modalHeading} variant="display1">Add an exchange or wallet</Typography>
            <SButton component={MyLinkToUserSettings} className={classes.button}>
                <Typography className={classes.buttonText}>Add</Typography>
                <AddIcon className={classes.iconSmall}/>
              </SButton>
          </PTextBox>
        </PTWrapper>
      )
    }

    return (
      <PTWrapper tableData={!!tableDataHasData}>
        {children}

        <GridContainer>
          <TableAndHeadingWrapper>
            <TableHeading>Portfolio</TableHeading>
            <Wrapper>
              <PTable>
                <PortfolioTableHead
                  isUSDCurrently={isUSDCurrently}
                  isSelectAll={isSelectAll}
                  onSelectAll={this.onSelectAll}
                  onSortTable={this.onSortTable}
                  currentSort={currentSort}
                />
                <PortfolioTableMain
                  tableData={tableData}
                  selectedBalances={selectedBalances}
                  isUSDCurrently={isUSDCurrently}
                  onSelectBalance={this.onSelectBalance}
                />
                {selectedSum.currency ? (
                  <PortfolioTableSum
                    selectedSum={selectedSum}
                    isUSDCurrently={isUSDCurrently}
                  />
                ) : null}
              </PTable>
            </Wrapper>
          </TableAndHeadingWrapper>

          <TableAndHeadingWrapper>
            <TableHeading>Trade history</TableHeading>
            <Wrapper>
              <TradeOrderHistoryTable isUSDCurrently={isUSDCurrently} />
            </Wrapper>
          </TableAndHeadingWrapper>

          <StyledDivider light />
          <PTChartContainer>
            <ChartTitle color="default" variant="title">
              Portfolio Value
            </ChartTitle>
            <Chart
              isShownMocks={this.props.isShownMocks}
              setActiveChart={this.props.setActiveChart}
              activeChart={this.props.activeChart}
              style={{
                marginLeft: 0,
                minHeight: '10vh',
              }}
              height="20vh"
              marginTopHr="10px"
              coins={
                this.state.selectedBalances &&
                  this.state.selectedBalances.length > 0
                  ? this.state.selectedBalances.map(
                    (idx) => this.state.tableData[idx]
                  )
                  : []
              }
            />
          </PTChartContainer>
        </GridContainer>
      </PTWrapper>
    )
  }
}

const GridContainer = styled.div`
  align-self: center;

  display: Grid;
  height: 70%;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 58% 1% 40%;

  @media (min-width: 1400px) {
    height: 100%;
  }
  @media (min-width: 1800px) {
    justify-content: center;

    grid-template-columns: 60% 40%;
    grid-template-rows: 58% 1% 40%;
  }
  @media (min-width: 3000px) {
    align-items: center;
  }
`

const ChartTitle = styled(Typography)`
  margin-left: 1.2rem;
`

const PTWrapper = styled.div`
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
  overflow-y: auto;
  @media (max-width: 840px) {
    margin: 1.5rem auto;
  }

  @media (max-width: 550px) {
    width: calc(100% - 90px);
    margin: 0.625rem auto;
  }

  @media (max-width: 425px) {
    width: calc(100% - 20px);
  }

  ${customAquaScrollBar};
`

const StyledDivider = styled(Divider)`
  margin-bottom: 1rem;
  grid-column: 1 / span 2;
`

const TableAndHeadingWrapper = styled.div`
  display: flex;
  margin: 0 20px 5px;
  flex-direction: column;
  overflow-x: scroll;

  ${customAquaScrollBar};
`

const TableHeading = styled.div`
  display: flex;
  text-transform: uppercase;
  font-family: Roboto, sans-serif;
  font-size: 17px;
  color: white;
  font-weight: bold;
  letter-spacing: 1.1px;
  min-height: 25px;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: scroll;

  ${customAquaScrollBar};
`

const PTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const PTextBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
  min-width: 400px;
  min-height: 350px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #2d3136;
`

const PTChartContainer = styled.div`
  position: relative;
  grid-column: 1 / span 2;
  height: 100%;
  @media (max-width: 500px) {
    display: none;
  }

  @media (max-height: 650px) {
    display: none;
  }
`

const SButton = styled(Button)`
    border-color: transparent;
    border-radius: 3px;
    background-color: #292d31;
    font-family: Roboto,sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-sizing: border-box;
    border: 1px solid;
    
    &&:hover {
      border-color: #4ed8da;
      background-color: #292d31;
    }
    
    && > span {
      display: flex;
      justify-content: space-between;
    }
`

const styles = theme => ({
  button: {
    paddingRight: 11,
  },
  modalHeading: {
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#fff',
  },
  // buttonSpan: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  // },
  buttonText: {
    fontWeight: 500,
  },
  iconSmall: {
    fontSize: 18,
  },
});



class MainDataWrapper extends React.Component {
  render() {
    return (
      <QueryRenderer
        component={PortfolioTableBalances}
        query={getPortfolioQuery}
        {...this.props}
      />
    )
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  setActiveChart: (ex: any) => dispatch(actions.setActiveChart(ex)),
})

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
  activeChart: store.portfolio.activeChart,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

// const storeComponent = connect(mapStateToProps, mapDispatchToProps)(
//   MainDataWrapper
// )

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(MainDataWrapper)
