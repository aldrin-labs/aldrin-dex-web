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
        (el: IShapeOfRebalancePortfolioRow) => ({
          exchange: el._id.exchange,
          symbol: el._id.coin,
          price: parseFloat(el.amount.$numberDecimal).toFixed(2),
          portfolioPerc: null,
          deltaPrice: el.diff.$numberDecimal,
        })
      )

      newTableCurrentPortfolioData = getMyPortfolio!.getProfile!.portfolio!.assets!.map(
        (el: IShapeOfCurrentPortolioRow) => ({
          exchange: el.exchange.name,
          symbol: el.asset.symbol,
          price: (parseFloat(el.asset.priceUSD) * el.value).toFixed(2),
          portfolioPerc: null,
        })
      )
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = getMyPortfolio!.getProfile!.portfolio!.assets!.map(
        (el: IShapeOfCurrentPortolioRow) => ({
          exchange: el.exchange.name,
          symbol: el.asset.symbol,
          price: (parseFloat(el.asset.priceUSD) * el.value).toFixed(2),
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

  onAddRowButtonClick = () => {
    const clonedRows = cloneArrayElementsOneLevelDeep(this.state.rows)
    const { totalRows, staticRows } = this.state
    const newRow = {
      exchange: 'Exchange',
      symbol: 'Coin',
      portfolioPerc: 0.0,
      deltaPrice: 0,
      price: 0,
      editable: true,
    }
    clonedRows.push(newRow)
    const rows = UTILS.calculatePercents(clonedRows, totalRows, staticRows)
    const totalPercents = UTILS.calculateTotalPercents(rows)
    console.log('rows in onAddRowButton ', rows)

    this.setState({ rows, totalPercents, areAllActiveChecked: false })
  }

  onDeleteRowClick = (idx: number) => {
    const { rows, undistributedMoney, staticRows } = this.state
    const clonedRows = rows.map((a) => ({ ...a }))
    const currentRowMoney = clonedRows[idx].price
    const isEditableCoin = clonedRows[idx].editable

    const resultRows = isEditableCoin
      ? [
          ...clonedRows.slice(0, idx),
          ...clonedRows.slice(idx + 1, clonedRows.length),
        ]
      : [
          ...clonedRows.slice(0, idx),
          {
            ...clonedRows[idx],
            price: '0',
          },
          ...clonedRows.slice(idx + 1, clonedRows.length),
        ]

    const newUndistributedMoney = (
      parseFloat(undistributedMoney) + parseFloat(currentRowMoney)
    ).toFixed(2)

    const newTotalRows = UTILS.calculateTotal(resultRows, newUndistributedMoney)
    const newTableTotalRows = UTILS.calculateTableTotal(resultRows)
    const newRowsWithNewPercents = UTILS.calculatePercents(
      resultRows,
      newTotalRows,
      staticRows
    )
    const totalPercents = UTILS.calculateTotalPercents(newRowsWithNewPercents)

    const newIsPercentSumGood = UTILS.checkPercentSum(newRowsWithNewPercents)

    this.setState({
      totalPercents,
      undistributedMoney: newUndistributedMoney,
      totalRows: newTotalRows,
      totalTableRows: newTableTotalRows,
      rows: newRowsWithNewPercents,
      isPercentSumGood: newIsPercentSumGood,
    })
  }

  onSelectActiveBalance = (idx: number) => {
    const selectedActive =
      (this.state.selectedActive && this.state.selectedActive.slice()) || []
    const hasIndex = selectedActive.indexOf(idx)
    if (hasIndex >= 0) {
      selectedActive.splice(hasIndex, 1)
    } else {
      selectedActive.push(idx)
    }

    const areAllActiveChecked = selectedActive.length === this.state.rows.length

    this.setState({ selectedActive, areAllActiveChecked })
  }

  onSelectAllActive = () => {
    const selectedActive =
      (this.state.selectedActive && this.state.selectedActive.slice()) || []
    let { areAllActiveChecked } = this.state
    if (selectedActive.length === this.state.rows.length) {
      selectedActive.splice(0, selectedActive.length)
      areAllActiveChecked = false
    } else {
      selectedActive.splice(0, selectedActive.length)
      this.state.rows.map((a, i) => {
        // if (i < this.state.rows.length - 1) {
        selectedActive.push(i)
        // }
      })
      areAllActiveChecked = true
    }
    this.setState({ selectedActive, areAllActiveChecked })
  }

  onSaveClick = () => {
    const {
      rows,
      totalRows,
      isPercentSumGood,
      undistributedMoney,
      staticRows,
    } = this.state

    console.log('rows rows rows: ', rows)

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

    console.log(updateRebalanceMutationQuery)

    const combinedRowsData = rows.map((el: IRow) => ({
      _id: {
        exchange: el.exchange,
        coin: el.symbol,
      },
      amount: el.price.toString(),
      percent: el.portfolioPerc.toString(),
      diff: el.deltaPrice.toString(),
    }))

    console.log(combinedRowsData)

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

  escFunction = (e: KeyboardEvent): void => {
    if (e.keyCode === 27 && this.state.isEditModeEnabled) {
      this.onEditModeEnable()
    }
  }

  onFocusPercentInput = (
    e: React.FocusEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { rows } = this.state
    let percentInput = e.target.value

    if (percentInput === '0' || percentInput === 0) {
      percentInput = ''
    }

    const clonedRows = rows!.map((a: IRow) => ({ ...a }))

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        portfolioPerc: percentInput,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    this.setState({
      rows: resultRows,
    })
  }

  onBlurPercentInput = (e: React.FocusEvent<HTMLInputElement>, idx: number) => {
    const { rows } = this.state
    let percentInput = e.target.value

    if (!/^([0-9]{1,3}\.|)$/.test(percentInput)) {
      return
    }
    if (percentInput === '') {
      percentInput = '0'
    } else {
      percentInput = percentInput.slice(0, -1)
    }

    const clonedRows = rows.map((a) => ({ ...a }))
    // clonedRows[idx].portfolioPerc = percentInput

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        portfolioPerc: percentInput,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    this.setState({
      rows: resultRows,
    })
  }

  onPercentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { rows, totalRows, staticRows } = this.state
    const percentInput = e.target.value

    if (
      !/^([0-9]\.[0-9]{1,4}|[0-9]\.?|(!?[1-9][0-9]\.[0-9]{1,4}|[1-9][0-9]\.?)|100|100\.?|100\.[0]{1,4}?|)$/.test(
        percentInput
      )
    ) {
      return
    }

    const clonedRows = rows.map((a: IRow) => ({ ...a }))
    // clonedRows[idx].portfolioPerc = percentInput

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        portfolioPerc: percentInput,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    const newCalculatedRowsWithPercents = UTILS.calculatePriceByPercents(
      resultRows,
      totalRows
    )

    const totalPercents = UTILS.calculateTotalPercents(
      newCalculatedRowsWithPercents
    )

    const rowWithNewPriceDiff = UTILS.calculatePriceDifference(
      newCalculatedRowsWithPercents,
      staticRows
    )

    const newTableTotalRows = UTILS.calculateTableTotal(
      newCalculatedRowsWithPercents
    )

    // NOT READY FOR NOW
    // TODO: MOVE ALL parsefloat from this
    const oldRowPrice = rows[idx].price
    const newRowPrice = newCalculatedRowsWithPercents[idx].price
    const oldNewPriceDiff = parseFloat(oldRowPrice) - parseFloat(newRowPrice)

    this.setState((prevState) => ({
      totalPercents,
      rows: rowWithNewPriceDiff,
      isPercentSumGood: UTILS.checkPercentSum(newCalculatedRowsWithPercents),
      undistributedMoney: (
        parseFloat(prevState.undistributedMoney) + oldNewPriceDiff
      ).toFixed(2),
      totalTableRows: parseFloat(newTableTotalRows),
    }))
  }

  handleSelectChange = (
    idx: number,
    name: string,
    optionSelected: { label: string; value: string } | null
  ) => {
    const { rows } = this.state
    const value = optionSelected ? optionSelected.value : ''
    const clonedRows = rows.map((a: IRow) => ({ ...a }))

    console.log('handleSelectChange idx: ', idx)
    console.log('handleSelectChange value: ', value)

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        [name]: value,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    this.setState(
      {
        rows: resultRows,
      },
      () => {
        console.log('this.state.rows', this.state.rows)
      }
    )
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

    console.log('staticRows in render: ', staticRows)

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
              onAddRowButtonClick={this.onAddRowButtonClick}
              onDeleteRowClick={this.onDeleteRowClick}
              onPercentInputChange={this.onPercentInputChange}
              onBlurPercentInput={this.onBlurPercentInput}
              onFocusPercentInput={this.onFocusPercentInput}
              handleSelectChange={this.handleSelectChange}
              onSelectActiveBalance={this.onSelectActiveBalance}
              onSelectAllActive={this.onSelectAllActive}
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
