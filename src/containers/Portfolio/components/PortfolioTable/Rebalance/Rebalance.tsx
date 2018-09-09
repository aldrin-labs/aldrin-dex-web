import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import BarChart from '@components/BarChart/BarChart'
import {
  IProps,
  IState,
  IRow,
  IShapeOfRebalancePortfolioRow,
  IShapeOfCurrentPortolioRow,
  IGetMyPortfolioQuery,
  IGetMyRebalanceQuery,
  ICurrentSort,
} from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'
import { mockTableData } from '@containers/Portfolio/components/PortfolioTable/Rebalance/mocks'
import {
  cloneArrayElementsOneLevelDeep,
  onSortTableFull,
} from '@utils/PortfolioTableUtils'
import { combineToBarChart } from './mocks'
import {
  updateRebalanceMutation,
  getMyRebalanceQuery,
  getMyPortfolioQuery,
} from '@containers/Portfolio/components/PortfolioTable/Rebalance/api'
import CurrentPortfolioTable from './CurrentPortfolioTable/CurrentPortfolioTable'
import RebalancedPortfolioTable from './RebalancedPortfolioTable/RebalancedPortfolioTable'
import * as UTILS from '@utils/PortfolioRebalanceUtils'

import {
  Content,
  ChartWrapper,
  ChartContainer,
  Chart,
  PTWrapper,
  PTextBox,
  Container,
} from './Rebalance.styles'
import ChartColorPicker from './ChartColorPicker/ChartColorPicker'

class Rebalance extends React.Component<IProps, IState> {
  state: IState = {
    selectedActive: null,
    areAllActiveChecked: false,
    rows: [],
    staticRows: [],
    savedRows: [],
    addMoneyInputValue: 0,
    currentSortForStatic: null,
    currentSortForDynamic: null,
    isEditModeEnabled: false,
    undistributedMoney: '0',
    undistributedMoneySaved: '0',
    totalRows: '0',
    totalStaticRows: '0',
    totalSavedRows: '0',
    totalTableRows: '0',
    totalTableStaticRows: '0',
    totalTableSavedRows: '0',
    isPercentSumGood: true,
    totalPercents: 0,
    leftBar: '#2496c8',
    rightBar: '#1869a8',
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction)

    const { isShownMocks, getMyRebalance, getMyPortfolio } = this.props

    this.combineRebalanceData(isShownMocks, getMyRebalance, getMyPortfolio)
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { isShownMocks, getMyRebalance, getMyPortfolio } = nextProps

    this.combineRebalanceData(isShownMocks, getMyRebalance, getMyPortfolio)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction)
  }

  combineRebalanceData = (
    isShownMocks: boolean,
    getMyRebalance: IGetMyRebalanceQuery,
    getMyPortfolio: IGetMyPortfolioQuery
  ) => {
    const userHasRebalancePortfolio =
      getMyRebalance &&
      getMyRebalance.getProfile &&
      getMyRebalance.getProfile.myRebalance &&
      getMyRebalance.getProfile.myRebalance.assets &&
      getMyRebalance.getProfile.myRebalance.assets.length > 0

    const userHasPortfolio =
      getMyPortfolio &&
      getMyPortfolio.getProfile &&
      getMyPortfolio.getProfile.portfolio &&
      getMyPortfolio.getProfile.portfolio.assets &&
      getMyPortfolio.getProfile.portfolio.assets.length > 0

    let newTableRebalancedPortfolioData = []
    let newTableCurrentPortfolioData = []

    if (userHasRebalancePortfolio && userHasPortfolio) {
      newTableRebalancedPortfolioData = getMyRebalance!.getProfile!.myRebalance!.assets!.map(
        (el: IShapeOfRebalancePortfolioRow, i:number) => ({
          id: i,
          exchange: el._id.exchange,
          symbol: el._id.coin,
          price: parseFloat(el.amount.$numberDecimal).toFixed(2),
          portfolioPerc: null,
          deltaPrice: el.diff.$numberDecimal,
        })
      )

      newTableCurrentPortfolioData = getMyPortfolio!.getProfile!.portfolio!.assets!.map(
        (el: IShapeOfCurrentPortolioRow, i: number) => ({
          id: i,
          exchange: el.exchange.name,
          symbol: el.asset.symbol,
          price: (parseFloat(el.asset.priceUSD) * el.quantity).toFixed(2),
          portfolioPerc: null,
        })
      )
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = getMyPortfolio!.getProfile!.portfolio!.assets!.map(
        (el: IShapeOfCurrentPortolioRow, i: number) => ({
          id: i,
          exchange: el.exchange.name,
          symbol: el.asset.symbol,
          price: (parseFloat(el.asset.priceUSD) * el.quantity).toFixed(2),
          portfolioPerc: null,
        })
      )
    }

    const composeWithMocksCurrentPortfolio = isShownMocks
      ? [...newTableCurrentPortfolioData, ...mockTableData]
      : newTableCurrentPortfolioData

    const composeWithMocksRebalancedPortfolio = isShownMocks
      ? [...newTableRebalancedPortfolioData, ...mockTableData]
      : newTableRebalancedPortfolioData

    if (userHasRebalancePortfolio) {
      this.setTableData(
        composeWithMocksCurrentPortfolio,
        composeWithMocksRebalancedPortfolio
      )
    } else {
      this.setTableData(
        composeWithMocksCurrentPortfolio,
        composeWithMocksCurrentPortfolio
      )
    }
  }

  setTableData = (
    tableDataCurrentPortfolio: IRow[],
    tableDataRebalancedPortfolio: IRow[]
  ) => {
    const { undistributedMoney } = this.state
    const rows = cloneArrayElementsOneLevelDeep(tableDataRebalancedPortfolio)
    const staticRows = cloneArrayElementsOneLevelDeep(tableDataCurrentPortfolio)
    const savedRows = cloneArrayElementsOneLevelDeep(
      tableDataRebalancedPortfolio
    )

    this.calculateAllTotals(staticRows, rows, savedRows, undistributedMoney)
  }

  calculateAllTotals = (
    staticRows: IRow[],
    rows: IRow[],
    savedRows: IRow[],
    undistributedMoney: string
  ) => {
    const totalStaticRows = UTILS.calculateTotal(staticRows, '0')
    const totalRows = UTILS.calculateTotal(rows, undistributedMoney)
    const totalSavedRows = UTILS.calculateTotal(savedRows, undistributedMoney)
    const totalTableStaticRows = UTILS.calculateTableTotal(staticRows)
    const totalTableRows = UTILS.calculateTableTotal(rows)
    const totalTableSavedRows = UTILS.calculateTableTotal(savedRows)

    this.calculateAllPercents(
      staticRows,
      totalStaticRows,
      rows,
      totalRows,
      savedRows,
      totalSavedRows
    )

    this.setState({
      totalStaticRows,
      totalRows,
      totalSavedRows,
      totalTableStaticRows,
      totalTableRows,
      totalTableSavedRows,
    })
  }

  calculateAllPercents = (
    staticRows: IRow[],
    totalStaticRows: string,
    rows: IRow[],
    totalRows: string,
    savedRows: IRow[],
    totalSavedRows: string
  ) => {
    const rowsWithPercentage = UTILS.calculatePercents(
      rows,
      totalRows,
      staticRows
    )
    this.setState({
      staticRows: UTILS.calculatePercents(
        staticRows,
        totalStaticRows,
        staticRows
      ),
      rows: rowsWithPercentage,
      totalPercents: UTILS.calculateTotalPercents(rowsWithPercentage),
      savedRows: UTILS.calculatePercents(savedRows, totalSavedRows, staticRows),
    })
  }

  onSaveClick = () => {
    const {
      rows,
      totalRows,
      isPercentSumGood,
      undistributedMoney,
      staticRows,
    } = this.state

    if (!isPercentSumGood) {
      return
    }
    if (+undistributedMoney < 0) {
      return
    }

    const rowsWithNewPrice = UTILS.calculatePriceByPercents(rows, totalRows)
    const newRowsWithPriceDiff = UTILS.calculatePriceDifference(
      rowsWithNewPrice,
      staticRows
    )
    const newRows = UTILS.removeEditableModeInCoins(newRowsWithPriceDiff)

    this.setState(
      {
        savedRows: cloneArrayElementsOneLevelDeep(newRows),
        rows: newRows,
        totalSavedRows: totalRows,
        isEditModeEnabled: false,
        selectedActive: [],
        areAllActiveChecked: false,
        undistributedMoneySaved: undistributedMoney,
      },
      () => {
        this.updateServerDataOnSave()
      }
    )
  }

  updateServerDataOnSave = async () => {
    const { updateRebalanceMutationQuery } = this.props
    const { rows, totalRows } = this.state

    const combinedRowsData = rows.map((el: IRow) => ({
      _id: {
        exchange: el.exchange,
        coin: el.symbol,
      },
      amount: el.price.toString(),
      percent: el.portfolioPerc.toString(),
      diff: el.deltaPrice.toString(),
    }))

    const variablesForMutation = {
      input: {
        total: totalRows.toString(),
        assets: {
          input: combinedRowsData,
        },
      },
    }

    try {
      await updateRebalanceMutationQuery({ variables: variablesForMutation })
    } catch (error) {
      console.log(error)
    }
  }

  onReset = () => {
    const clonedStaticRows = cloneArrayElementsOneLevelDeep(
      this.state.staticRows
    )

    this.setState({
      rows: clonedStaticRows,
      totalRows: this.state.totalStaticRows,
      totalTableRows: this.state.totalTableStaticRows,
      undistributedMoney: '0',
      selectedActive: [],
      areAllActiveChecked: false,
      isPercentSumGood: UTILS.checkPercentSum(clonedStaticRows),
      totalPercents: UTILS.calculateTotalPercents(clonedStaticRows),
    })
  }

  onEditModeEnable = () => {
    if (this.state.isEditModeEnabled) {
      const clonedSavedRows = cloneArrayElementsOneLevelDeep(
        this.state.savedRows
      )

      this.setState((prevState: IState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
        totalRows: this.state.totalSavedRows,
        totalTableRows: this.state.totalTableSavedRows,
        rows: clonedSavedRows,
        selectedActive: [],
        areAllActiveChecked: false,
        undistributedMoney: this.state.undistributedMoneySaved,
        isPercentSumGood: UTILS.checkPercentSum(clonedSavedRows),
        totalPercents: UTILS.calculateTotalPercents(clonedSavedRows),
      }))
    } else {
      this.setState((prevState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
      }))
    }
  }

  onSortTable = (key: string, tableForSort: string) => {
    if (!this.state.staticRows && tableForSort === 'currentSortForStatic') {
      return
    }
    if (!this.state.rows && tableForSort === 'currentSortForDynamic') {
      return
    }

    const arrayOfStringHeadings = ['exchange', 'symbol']
    const currentSort: ICurrentSort = (this.state as any)[tableForSort]
    const rowsForSortText =
      tableForSort === 'currentSortForStatic' ? 'staticRows' : 'rows'
    const currentRowsForSort = this.state[rowsForSortText]

    const {
      newData,
      newCurrentSort,
    }: {
      newData: IRow[]
      newCurrentSort: ICurrentSort | null
    } = onSortTableFull(
      key,
      currentRowsForSort,
      currentSort,
      arrayOfStringHeadings
    )

    this.setState({
      [rowsForSortText]: newData,
      [tableForSort]: newCurrentSort,
    })
  }

  onChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  updateState = (obj: object) => {
    this.setState(obj)
  }

  escFunction = (e: KeyboardEvent): void => {
    if (e.keyCode === 27 && this.state.isEditModeEnabled) {
      this.onEditModeEnable()
    }
  }

  render() {
    console.log('RENDER')

    const {
      children,
      isUSDCurrently,
      filterValueSmallerThenPercentage,
    } = this.props
    const {
      selectedActive,
      areAllActiveChecked,
      currentSortForStatic,
      currentSortForDynamic,
      totalStaticRows,
      totalRows,
      isEditModeEnabled,
      undistributedMoney,
      isPercentSumGood,
      totalPercents,
      totalTableRows,
      rows,
      staticRows,
      addMoneyInputValue,
      leftBar,
      rightBar,
    } = this.state

    const tableDataHasData = !staticRows.length || !rows.length

    if (tableDataHasData) {
      return (
        <PTWrapper tableData={tableDataHasData}>
          {children}
          <PTextBox>Add account for Portfolio</PTextBox>
        </PTWrapper>
      )
    }

    return (
      <PTWrapper tableData={true}>
        {children}
        <Content>
          <Container>
            <CurrentPortfolioTable
              {...{
                currentSortForStatic,
                staticRows,
                totalStaticRows,
                filterValueSmallerThenPercentage,
                isUSDCurrently,
              }}
              onSortTable={this.onSortTable}
            />
            <RebalancedPortfolioTable
              {...{
                isEditModeEnabled,
                staticRows,
                rows,
                currentSortForDynamic,
                selectedActive,
                areAllActiveChecked,
                totalRows,
                totalPercents,
                totalTableRows,
                isPercentSumGood,
                undistributedMoney,
                isUSDCurrently,
                addMoneyInputValue,
              }}
              onSortTable={this.onSortTable}
              onSaveClick={this.onSaveClick}
              onReset={this.onReset}
              onEditModeEnable={this.onEditModeEnable}
              updateState={this.updateState}
            />
          </Container>
          <ChartWrapper isEditModeEnabled={isEditModeEnabled}>
            <ChartColorPicker
              leftBar={leftBar}
              rightBar={rightBar}
              onChangeColor={this.onChangeColor}
            />
            <ChartContainer>
              <Chart>
                {staticRows[0].portfolioPerc && (
                  <BarChart
                    alwaysShowLegend={true}
                    charts={[
                      {
                        data: combineToBarChart(staticRows),
                        color: this.state.leftBar,
                        title: 'Current',
                      },
                      {
                        data: combineToBarChart(rows),
                        color: this.state.rightBar,
                        title: 'Rebalanced',
                      },
                    ]}
                  />
                )}
              </Chart>
            </ChartContainer>
          </ChartWrapper>
        </Content>
      </PTWrapper>
    )
  }
}

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

export default compose(
  connect(mapStateToProps),
  graphql(getMyPortfolioQuery, { name: 'getMyPortfolio' }),
  graphql(getMyRebalanceQuery, { name: 'getMyRebalance' }),
  graphql(updateRebalanceMutation, {
    name: 'updateRebalanceMutationQuery',
    options: ({ values }) => ({
      refetchQueries: [
        {
          query: getMyRebalanceQuery,
        },
      ],
      ...values,
    }),
  })
)(Rebalance)
