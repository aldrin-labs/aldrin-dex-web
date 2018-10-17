import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import QueryRenderer from '@components/QueryRenderer'
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
  getMyPortfolioAndRebalanceQuery,
} from '@containers/Portfolio/api'
import CurrentPortfolioTable from './CurrentPortfolioTable/CurrentPortfolioTable'
import RebalancedPortfolioTable from './RebalancedPortfolioTable/RebalancedPortfolioTable'
import * as UTILS from '@utils/PortfolioRebalanceUtils'

import {
  Content,
  ChartWrapper,
  ChartContainer,
  Chart,
  PTextBox,
  Container,
} from './Rebalance.styles'
import ChartColorPicker from './ChartColorPicker/ChartColorPicker'
import withTheme from '@material-ui/core/styles/withTheme'
import { PTWrapper } from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances/PortfolioTableBalances.styles'
import EmptyTablePlaceholder from '@components/EmptyTablePlaceholder'

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

    const { isShownMocks, data } = this.props
    this.combineRebalanceData(isShownMocks, data.myPortfolios[0])
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { isShownMocks, data } = nextProps

    this.combineRebalanceData(isShownMocks, data.myPortfolios[0])
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction)
  }

  combineRebalanceData = (
    isShownMocks: boolean,
    getMyPortfolioAndRebalanceQuery
  ) => {
    const userHasRebalancePortfolio =
      getMyPortfolioAndRebalanceQuery &&
      getMyPortfolioAndRebalanceQuery.myRebalance &&
      getMyPortfolioAndRebalanceQuery.myRebalance.assets &&
      getMyPortfolioAndRebalanceQuery.myRebalance.assets.length > 0

    const userHasPortfolio =
      getMyPortfolioAndRebalanceQuery &&
      getMyPortfolioAndRebalanceQuery.portfolioAssets &&
      getMyPortfolioAndRebalanceQuery.portfolioAssets.length > 0

    let newTableRebalancedPortfolioData = []
    let newTableCurrentPortfolioData = []

    if (userHasRebalancePortfolio && userHasPortfolio) {
      newTableRebalancedPortfolioData = getMyPortfolioAndRebalanceQuery.myRebalance.assets!.map(
        (el: IShapeOfRebalancePortfolioRow, i: number) => ({
          id: i,
          exchange: el._id.exchange,
          symbol: el._id.coin,
          price: parseFloat(el.amount.$numberDecimal).toFixed(2),
          portfolioPerc: null,
          deltaPrice: el.diff.$numberDecimal,
        })
      )

      newTableCurrentPortfolioData = getMyPortfolioAndRebalanceQuery.portfolioAssets!.map(
        (el, i: number) => ({
          id: i,
          exchange: el.where,
          symbol: el.coin,
          price: (parseFloat(el.price) * el.quantity).toFixed(2),
          portfolioPerc: null,
        })
      )
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = getMyPortfolioAndRebalanceQuery.portfolioAssets!.map(
        (el, i: number) => ({
          id: i,
          exchange: el.where,
          symbol: el.coin,
          price: (parseFloat(el.price) * el.quantity).toFixed(2),
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

    // if something will broke just uncomment these lines
    // const rowsWithNewPrice = UTILS.calculatePriceByPercents(rows, totalRows)
    // const newRowsWithPriceDiff = UTILS.calculatePriceDifference(
    //   rowsWithNewPrice,
    //   staticRows
    // )
    const newRowsWithPriceDiff = UTILS.calculatePriceDifference(
      rows,
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
    const {
      children,
      isUSDCurrently,
      filterValueSmallerThenPercentage,
      theme,
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

    return (
      <EmptyTablePlaceholder isEmpty={!tableDataHasData}>
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
                  theme,
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
                  theme,
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
              <ChartContainer elevation={10}>
                <Chart>
                  {staticRows[0].portfolioPerc && (
                    <BarChart
                      hideDashForToolTip={true}
                      xAxisVertical={true}
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
      </EmptyTablePlaceholder>
    )
  }
}

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})
const RebalanceContainer = (props) => (
  <QueryRenderer
    fetchPolicy="network-only"
    component={Rebalance}
    query={getMyPortfolioAndRebalanceQuery}
    variables={{ baseCoin: 'USDT' }}
    {...props}
  />
)

export default compose(
  withTheme(),
  connect(mapStateToProps),
  graphql(updateRebalanceMutation, {
    name: 'updateRebalanceMutationQuery',
    options: ({ values }) => ({
      refetchQueries: [
        {
          query: getMyPortfolioAndRebalanceQuery,
          variables: ({baseCoin: 'USDT'}),
        },
      ],
      ...values,
    }),
  })
)(RebalanceContainer)
