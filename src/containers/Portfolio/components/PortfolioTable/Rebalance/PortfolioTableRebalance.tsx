import * as React from 'react'
import styled, { css } from 'styled-components'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import SelectReact, { components } from 'react-select'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import SaveIcon from 'material-ui-icons/Save'
import UndoIcon from 'material-ui-icons/Undo'
import EditIcon from 'material-ui-icons/Edit'
import Replay from 'material-ui-icons/Replay'
import ClearIcon from 'material-ui-icons/Clear'

import BarChart from '@components/BarChart/BarChart'
import PieChart from '@components/PieChart'
import { customAquaScrollBar } from '@utils/cssUtils'
import sortIcon from '@icons/arrow.svg'
import {
  IProps,
  IState,
  IRow,
} from '@containers/Portfolio/components/PortfolioTable/Rebalance/PortfolioTableRebalance.types'
import {
  mockTableData,
  combineToChart,
} from '@containers/Portfolio/components/PortfolioTable/Rebalance/mocks'
import {
  onSortStrings,
  cloneArrayElementsOneLevelDeep,
} from '@utils/PortfolioTableUtils'
import { Args } from '@containers/Portfolio/components/PortfolioTable/types'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import spinLoader from '@icons/tail-spin.svg'
import dropDownIcon from '@icons/baseline-arrow_drop_down.svg'
import { exchangeOptions, coinsOptions, combineToBarChart } from './mocks'
import {
  updateRebalanceMutation,
  getMyRebalanceQuery,
  getMyPortfolioQuery,
} from '@containers/Portfolio/components/PortfolioTable/Rebalance/api'

const usdHeadingForCurrent = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'USD', value: 'price' },
]

const btcHeadingForCurrent = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'BTC', value: 'price' },
]

const usdHeadingForRebalanced = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'USD', value: 'price' },
  { name: 'Trade', value: 'trade' },
]

const btcHeadingForRebalanced = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'BTC', value: 'price' },
  { name: 'Trade', value: 'trade' },
]

let tableHeadingsCurrentPortfolio = usdHeadingForCurrent
let tableHeadingsRebalancedPortfolio = usdHeadingForRebalanced

class PortfolioTableRebalance extends React.Component<IProps, IState> {
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
    undistributedMoney: 0,
    undistributedMoneySaved: 0,
    totalRows: 0,
    totalStaticRows: 0,
    totalSavedRows: 0,
    totalTableRows: 0,
    totalTableStaticRows: 0,
    totalTableSavedRows: 0,
    isPercentSumGood: true,
    totalPercents: 0,
    leftBar: '#2496c8',
    rightBar: '#1869a8',
  }

  onChangeColor = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  componentWillMount() {
    // this.calculateAllTotals()
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction)

    const { data, isShownMocks, getMyRebalance, getMyPortfolio } = this.props

    // console.log('refetch',getMyRebalance.refetch());

    console.log(' getMyRebalance in DidMount', getMyRebalance)

    console.log(' getMyPortfolio in DidMount', getMyPortfolio)

    // console.log('data in componentDidMount' + '', data)

    // getMyRebalance.getProfile.myRebalance

    // const userHasRebalancePortfolio =
    //   data &&
    //   data.myRebalance &&
    //   data.myRebalance.assets &&
    //   data.myRebalance.assets.length > 0
    const userHasRebalancePortfolio =
      getMyRebalance &&
      getMyRebalance.getProfile &&
      getMyRebalance.getProfile.myRebalance &&
      getMyRebalance.getProfile.myRebalance.assets &&
      getMyRebalance.getProfile.myRebalance.assets.length > 0

    // const userHasPortfolio = data && data.portfolio.assets.length > 0
    const userHasPortfolio =
      getMyPortfolio.getProfile.portfolio &&
      getMyPortfolio.getProfile.portfolio.assets.length > 0

    console.log('userHasRebalancePortfolio', userHasRebalancePortfolio)
    console.log('userHasPortfolio', userHasPortfolio)

    let newTableRebalancedPortfolioData = []
    let newTableCurrentPortfolioData = []

    if (userHasRebalancePortfolio && userHasPortfolio) {
      newTableRebalancedPortfolioData = getMyRebalance.getProfile.myRebalance.assets.map(
        (el) => ({
          exchange: el._id.exchange,
          symbol: el._id.coin,
          price: parseFloat(el.amount['$numberDecimal']).toFixed(2),
          deltaPrice: el.diff['$numberDecimal'],
        })
      )

      newTableCurrentPortfolioData = getMyPortfolio.getProfile.portfolio.assets.map(
        (el) => ({
          exchange: el.exchange.name,
          symbol: el.asset.symbol,
          price: (parseFloat(el.asset.priceUSD) * parseFloat(el.value)).toFixed(
            2
          ),
        })
      )

      console.log(
        'newTableRebalancedPortfolioData in didMount',
        newTableRebalancedPortfolioData
      )
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = getMyPortfolio.getProfile.portfolio.assets.map(
        (el) => ({
          exchange: el.exchange.name,
          symbol: el.asset.symbol,
          price: (parseFloat(el.asset.priceUSD) * parseFloat(el.value)).toFixed(
            2
          ),
        })
      )

      console.log('132323')
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

    // const composeWithMocks = isShownMocks
    //   ? [...newTableData, ...mockTableData]
    //   : newTableData
    //
    // this.setTableData(composeWithMocks)
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { data, isShownMocks, getMyRebalance, getMyPortfolio } = nextProps

    console.log(' getMyPortfolio in WillReceiveProps', getMyPortfolio)
    console.log('getMyRebalance in WillReceiveProps', getMyRebalance)

    // console.log('data in componentWillReceiveProps', data)

    // getMyRebalance.getProfile.myRebalance

    // const userHasRebalancePortfolio =
    //   data &&
    //   data.myRebalance &&
    //   data.myRebalance.assets &&
    //   data.myRebalance.assets.length > 0
    const userHasRebalancePortfolio =
      getMyRebalance &&
      getMyRebalance.getProfile &&
      getMyRebalance.getProfile.myRebalance &&
      getMyRebalance.getProfile.myRebalance.assets &&
      getMyRebalance.getProfile.myRebalance.assets.length > 0

    // const userHasPortfolio = data && data.portfolio.assets.length > 0
    const userHasPortfolio =
      getMyPortfolio.getProfile.portfolio &&
      getMyPortfolio.getProfile.portfolio.assets.length > 0

    console.log('userHasRebalancePortfolio', userHasRebalancePortfolio)
    console.log('userHasPortfolio', userHasPortfolio)

    let newTableRebalancedPortfolioData = []
    let newTableCurrentPortfolioData = []

    if (userHasRebalancePortfolio && userHasPortfolio) {
      newTableRebalancedPortfolioData = getMyRebalance.getProfile.myRebalance.assets.map(
        (el) => ({
          exchange: el._id.exchange,
          symbol: el._id.coin,
          price: parseFloat(el.amount['$numberDecimal']).toFixed(2),
          deltaPrice: el.diff['$numberDecimal'],
        })
      )

      newTableCurrentPortfolioData = getMyPortfolio.getProfile.portfolio.assets.map(
        (el) => ({
          exchange: el.exchange.name,
          symbol: el.asset.symbol,
          price: (parseFloat(el.asset.priceUSD) * parseFloat(el.value)).toFixed(
            2
          ),
        })
      )

      console.log(
        'newTableRebalancedPortfolioData in didMount',
        newTableRebalancedPortfolioData
      )
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = getMyPortfolio.getProfile.portfolio.assets.map(
        (el) => ({
          exchange: el.exchange.name,
          symbol: el.asset.symbol,
          price: (parseFloat(el.asset.priceUSD) * parseFloat(el.value)).toFixed(
            2
          ),
        })
      )

      console.log('132323')
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

    // const composeWithMocks = isShownMocks
    //   ? [...newTableData, ...mockTableData]
    //   : newTableData

    // this.setTableData(composeWithMocks)

    if (nextProps.isUSDCurrently !== this.props.isUSDCurrently) {
      if (nextProps.isUSDCurrently) {
        tableHeadingsCurrentPortfolio = usdHeadingForCurrent
        tableHeadingsRebalancedPortfolio = usdHeadingForRebalanced
      } else {
        tableHeadingsCurrentPortfolio = btcHeadingForCurrent
        tableHeadingsRebalancedPortfolio = btcHeadingForRebalanced
      }
    }
  }

  setTableData = (tableDataCurrentPortfolio, tableDataRebalancedPortfolio) => {
    // TODO: This should be refactored (no second set-state)

    this.setState(
      {
        rows: cloneArrayElementsOneLevelDeep(tableDataRebalancedPortfolio),
        staticRows: cloneArrayElementsOneLevelDeep(tableDataCurrentPortfolio),
        savedRows: cloneArrayElementsOneLevelDeep(tableDataRebalancedPortfolio),
      },
      () => {
        this.calculateAllTotals()
      }
    )
  }

  calculateAllTotals = () => {
    const { staticRows, rows, savedRows, undistributedMoney } = this.state

    this.setState(
      {
        totalStaticRows: this.calculateTotal(staticRows, 0),
        totalRows: this.calculateTotal(rows, undistributedMoney),
        totalSavedRows: this.calculateTotal(savedRows, undistributedMoney),
        totalTableRows: this.calculateTableTotal(rows),
        totalTableStaticRows: this.calculateTableTotal(staticRows),
        totalTableSavedRows: this.calculateTableTotal(savedRows),
      },
      () => {
        this.calculateAllPercents()
      }
    )
  }

  calculateAllPercents = () => {
    this.setState({
      staticRows: this.calculatePercents(
        this.state.staticRows,
        this.state.totalStaticRows
      ),
      rows: this.calculatePercents(this.state.rows, this.state.totalRows),
      savedRows: this.calculatePercents(
        this.state.savedRows,
        this.state.totalSavedRows
      ),
    })
  }

  calculatePriceDifference = (data: IRow[]) => {
    let { staticRows } = this.state

    data.forEach((row, i) => {
      staticRows.forEach((staticRow, j) => {
        if (
          data[i].exchange === staticRows[j].exchange &&
          data[i].symbol === staticRows[j].symbol
        ) {
          // TODO: Refactor when we have much more time than now
          // tslint:disable-next-line no-object-mutation
          data[i].deltaPrice = (data[i].price - staticRows[j].price).toFixed(2)
        }
      })
    })

    console.log(
      'data.length > staticRows.length',
      data.length > staticRows.length
    )

    // TODO: Refactor this (delete newCoinsData and replace it)
    if (data.length > staticRows.length) {
      let arrayOfNewCoinIndexes = []
      const newCoinsData = data.filter((el, i) => {
        if (
          !staticRows.some(
            (element) =>
              element.exchange === el.exchange && element.symbol === el.symbol
          )
        ) {
          arrayOfNewCoinIndexes.push(i)

          return true
        }
      })

      data = data.map((row, i) => {
        if (arrayOfNewCoinIndexes.includes(i)) {
          return {
            ...row,
            deltaPrice: (row.price - 0).toFixed(2),
          }
        }

        return row
      })
    }

    console.log('data length', data.length)
    console.log('staticRows length', staticRows.length)
    console.log('data in caluclatePriceDiff', data)

    return data
  }

  calculateTotal = (data: IRow[], undistributedMoney: number) => {
    const total = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

    return (parseFloat(total) + parseFloat(undistributedMoney)).toFixed(2)
  }

  calculateTableTotal = (data: IRow[]) => {
    const tableTotal = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

    return parseFloat(tableTotal).toFixed(2)
  }

  calculateTotalPercents = (data: IRow[]) => {
    const totalPercents = data
      .reduce((sum, row) => (sum += +row!.portfolioPerc), 0)
      .toFixed(3)

    return totalPercents
  }

  calculatePercents = (data: IRow[], total: number) => {
    const newDataWithPercents = data.map((row) => {
      const percentCaluclation =
        +row.price === 0 ? '0' : (row.price * 100 / total).toFixed(4)
      const percentResult = +percentCaluclation === 0 ? '0' : percentCaluclation

      return {
        ...row,
        portfolioPerc: percentResult,
      }
    })

    const totalPercents = this.calculateTotalPercents(newDataWithPercents)

    this.setState({
      totalPercents,
    })

    return this.calculatePriceDifference(newDataWithPercents)
  }

  renderActiveCheckbox = (idx: number) => {
    const { selectedActive } = this.state
    const isSelected =
      (selectedActive && selectedActive.indexOf(idx) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={idx} checked={isSelected} />
        <Label htmlFor={idx} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onAddRowButtonClick = () => {
    let rows = cloneArrayElementsOneLevelDeep(this.state.rows)
    let { totalRows } = this.state
    let newRow = {
      exchange: 'Exchange',
      symbol: 'Coin',
      portfolioPerc: 0.0,
      deltaPrice: 0,
      price: 0,
      editable: true,
    }
    rows.push(newRow)
    rows = this.calculatePercents(rows, totalRows)
    console.log('rows in onAddRowButton ', rows)

    this.setState({ rows, areAllActiveChecked: false })
  }

  onDeleteRowClick = (idx: number) => {
    const { rows, undistributedMoney } = this.state
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
            price: 0,
          },
          ...clonedRows.slice(idx + 1, clonedRows.length),
        ]

    const newUndistributedMoney = (
      parseFloat(undistributedMoney) + parseFloat(currentRowMoney)
    ).toFixed(2)

    const newTotalRows = this.calculateTotal(resultRows, newUndistributedMoney)
    const newTableTotalRows = this.calculateTableTotal(resultRows)
    const newRowsWithNewPercents = this.calculatePercents(
      resultRows,
      newTotalRows
    )
    const newIsPercentSumGood = this.checkPercentSum(newRowsWithNewPercents)

    this.setState({
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

  calculatePriceByPercents = (data: IRow[]) => {
    const { totalRows } = this.state

    const dataWithNewPrices = data.map((row: IRow) => {
      let newPrice = (totalRows / 100 * row.portfolioPerc).toFixed(2)

      return {
        ...row,
        price: newPrice,
      }
    })

    return dataWithNewPrices
  }

  removeEditableModeInCoins = (rows) => {
    return rows.map((el) => {
      if (el.editable) {
        return {
          ...el,
          editable: false,
        }
      }

      return el
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

    console.log('rows rows rows: ', rows)

    if (!isPercentSumGood) {
      return
    }
    if (undistributedMoney < 0) {
      return
    }

    const rowsWithNewPrice = this.calculatePriceByPercents(rows)
    const newRowsWithPriceDiff = this.calculatePriceDifference(rowsWithNewPrice)
    const newRows = this.removeEditableModeInCoins(newRowsWithPriceDiff)

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
    const { staticRows, totalStaticRows, rows, totalRows } = this.state

    console.log(updateRebalanceMutationQuery)

    const combinedRowsData = rows.filter((el) => !el.mock).map((el) => {
      return {
        _id: {
          exchange: el.exchange,
          coin: el.symbol,
        },
        amount: el.price.toString(),
        percent: el.portfolioPerc.toString(),
        diff: el.deltaPrice.toString(),
      }
    })

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

  onLoadPreviousClick = () => {
    this.setState({
      rows: cloneArrayElementsOneLevelDeep(this.state.savedRows),
      totalRows: this.state.totalSavedRows,
      totalTableRows: this.state.totalTableSavedRows,
      undistributedMoney: this.state.undistributedMoneySaved,
    })
  }
  onReset = () => {
    const clonedStaticRows = cloneArrayElementsOneLevelDeep(
      this.state.staticRows
    )

    this.setState({
      rows: clonedStaticRows,
      totalRows: this.state.totalStaticRows,
      totalTableRows: this.state.totalTableStaticRows,
      undistributedMoney: 0,
      selectedActive: [],
      areAllActiveChecked: false,
      isPercentSumGood: this.checkPercentSum(clonedStaticRows),
      totalPercents: this.calculateTotalPercents(clonedStaticRows),
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
        isPercentSumGood: this.checkPercentSum(clonedSavedRows),
        totalPercents: this.calculateTotalPercents(clonedSavedRows),
      }))
    } else {
      this.setState((prevState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
      }))
    }
  }

  escFunction = (e: any) => {
    if (e.keyCode === 27) {
      this.onEditModeEnable()
    }
  }

  onDeleteUndistributedMoney = () => {
    const { rows } = this.state

    const newUndistributedMoney = 0
    const newTotalRows = this.calculateTotal(rows, newUndistributedMoney)
    const newTableTotalRows = this.calculateTableTotal(rows)
    const newRowsWithNewPercents = this.calculatePercents(rows, newTotalRows)
    const newIsPercentSumGood = this.checkPercentSum(newRowsWithNewPercents)

    this.setState({
      undistributedMoney: 0,
      totalRows: newTotalRows,
      totalTableRows: newTableTotalRows,
      rows: newRowsWithNewPercents,
      isPercentSumGood: newIsPercentSumGood,
    })
  }

  onDistribute = () => {
    let { selectedActive, rows, undistributedMoney } = this.state
    if (selectedActive && selectedActive.length > 0) {
      let money = parseFloat(undistributedMoney)

      if (selectedActive.length > 1) {
        let moneyPart = Math.floor(money / selectedActive.length)
        selectedActive.forEach((row, i) => {
          // TODO: Refactor when we have much more time than now
          // tslint:disable-next-line no-object-mutation
          let roundedCurrentPrice = parseFloat(rows![selectedActive![i]]!.price)
          rows![selectedActive![i]]!.price = roundedCurrentPrice + moneyPart
          money -= moneyPart
        })
      } else {
        // tslint:disable-next-line no-object-mutation
        let roundedPrice = parseFloat(rows![selectedActive![0]]!.price)
        // console.log('roundedPrice', roundedPrice, 'typeof roundedPrice', typeof roundedPrice);
        // console.log('undistributedMoney', undistributedMoney, 'typeof undistributedMoney', typeof undistributedMoney);

        rows![selectedActive![0]]!.price =
          roundedPrice + parseFloat(undistributedMoney)
        money = 0
      }

      const newUndistributedMoney = money

      const newTotal = this.calculateTotal(rows, newUndistributedMoney)
      const newTableTotal = this.calculateTableTotal(rows)
      const newRows = this.calculatePercents(rows, newTotal)

      this.setState({
        undistributedMoney: newUndistributedMoney,
        selectedActive,
        rows: newRows,
        totalRows: newTotal,
        totalTableRows: newTableTotal,
        isPercentSumGood: this.checkPercentSum(newRows),
      })
    }
  }

  onAddMoneyInputChange = (e: any) => {
    const inputAddMoney = e.target.value

    if (!/^(!?(-?[0-9]+\.?[0-9]+)|(-?[0-9]\.?)|)$/.test(inputAddMoney)) {
      console.log('not our number')

      return
    }

    this.setState({ addMoneyInputValue: inputAddMoney })
  }
  onFocusAddMoneyInput = (e: any) => {
    let inputAddMoney = e.target.value

    if (inputAddMoney === 0 || inputAddMoney === '0') {
      inputAddMoney = ''
      this.setState({ addMoneyInputValue: inputAddMoney })
    }
  }

  checkPercentSum = (data: IRow[]) => {
    const sumOfAllPercents = data.reduce(
      (sum, row) => (sum += +row!.portfolioPerc),
      0
    )

    console.log(
      'sumOfAllPercents: ',
      sumOfAllPercents,
      'is good sum: ',
      Math.abs(sumOfAllPercents - 100) <= 0.001 || sumOfAllPercents === 0
    )

    return Math.abs(sumOfAllPercents - 100) <= 0.001 || sumOfAllPercents === 0
  }

  onFocusPercentInput = (e: any, idx: number) => {
    const { rows } = this.state
    let percentInput = e.target.value

    if (percentInput === '0' || percentInput === 0) {
      percentInput = ''
    }

    const clonedRows = rows!.map((a) => ({ ...a }))

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

  onBlurPercentInput = (e: any, idx: number) => {
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

  onPercentInputChange = (e: any, idx: number) => {
    const { rows } = this.state
    let percentInput = e.target.value

    if (
      !/^([0-9]\.[0-9]{1,4}|[0-9]\.?|(!?[1-9][0-9]\.[0-9]{1,4}|[1-9][0-9]\.?)|100|100\.?|100\.[0]{1,4}?|)$/.test(
        percentInput
      )
    ) {
      return
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

    const newCalculatedRowsWithPercents = this.calculatePriceByPercents(
      resultRows
    )

    const totalPercents = this.calculateTotalPercents(
      newCalculatedRowsWithPercents
    )

    const rowWithNewPriceDiff = this.calculatePriceDifference(
      newCalculatedRowsWithPercents
    )

    // const newTotalRows = this.calculateTotal(newCalculatedRowsWithPercents)
    const newTableTotalRows = this.calculateTableTotal(
      newCalculatedRowsWithPercents
    )

    // NOT READY FOR NOW
    // TODO: SHOULD BE another function and NO SECOND SETSTATE!!!
    let oldRowPrice = rows[idx].price
    let newRowPrice = newCalculatedRowsWithPercents[idx].price
    let oldNewPriceDiff = oldRowPrice - newRowPrice

    this.setState(
      {
        rows: rowWithNewPriceDiff,
        isPercentSumGood: this.checkPercentSum(newCalculatedRowsWithPercents),
        totalPercents,
      },
      () => {
        // if (oldRowPrice > newRowPrice) {
        this.setState((prevState) => ({
          undistributedMoney: parseFloat(
            parseFloat(prevState.undistributedMoney) + oldNewPriceDiff
          ).toFixed(2),
          totalTableRows: newTableTotalRows,
        }))
        // }
      }
    )
  }
  // TODO: Should be one function
  handleSelectChangeWithoutInputExchange(
    idx: number,
    optionSelected: { label: string; value: string } | null
  ) {
    const { rows } = this.state
    const value = optionSelected ? optionSelected.value : ''
    const clonedRows = rows.map((a) => ({ ...a }))

    console.log('handleSelectChange idx: ', idx)

    console.log('handleSelectChange value: ', value)

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        exchange: value,
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

  // TODO: Should be one function
  handleSelectChangeWithoutInputCoin(
    idx: number,
    optionSelected: { label: string; value: string } | null
  ) {
    const { rows } = this.state
    const value = optionSelected ? optionSelected.value : ''
    const clonedRows = rows.map((a) => ({ ...a }))

    console.log('handleSelectChange idx: ', idx)

    console.log('handleSelectChange value: ', value)

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        symbol: value,
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

  onEditCoinName = (e: any, idx: number) => {
    const { rows } = this.state
    let nameCurrencyInput = e.target.value

    const clonedRows = rows.map((a) => ({ ...a }))
    // clonedRows[idx].exchange = nameCurrencyInput

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        exchange: nameCurrencyInput,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    this.setState({
      rows: resultRows,
    })
  }

  onEditCoinSymbol = (e: any, idx: number) => {
    const { rows } = this.state
    let symbolCurrencyInput = e.target.value

    const clonedRows = rows.map((a) => ({ ...a }))
    // clonedRows[idx].symbol = symbolCurrencyInput

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        symbol: symbolCurrencyInput,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    this.setState({
      rows: resultRows,
    })
  }

  onAddMoneyButtonPressed = () => {
    if (+this.state.addMoneyInputValue === 0) {
      return
    }
    console.log('addmoneypressed')

    let { rows, addMoneyInputValue, undistributedMoney } = this.state

    const newUndistributedMoney = parseFloat(
      (Number(undistributedMoney) + Number(addMoneyInputValue)).toFixed(2)
    )

    const newTotal = this.calculateTotal(rows, newUndistributedMoney)
    const newTableTotal = this.calculateTableTotal(rows)

    const newRows = this.calculatePercents(rows, newTotal)
    const checkedPercentsIsGood = this.checkPercentSum(newRows)

    this.setState({
      undistributedMoney: newUndistributedMoney,
      addMoneyInputValue: 0,
      rows: newRows,
      totalRows: newTotal,
      totalTableRows: newTableTotal,
      isPercentSumGood: checkedPercentsIsGood,
    })
  }

  onSortTable = (key: Args, chooseRows: string) => {
    let currentRowsForSort: IRow[]
    let currentRowsForSortText: string
    let currentSort: { key: string; arg: 'ASC' | 'DESC' } | null
    let currentSortText: string
    const {
      staticRows,
      rows,
      currentSortForStatic,
      currentSortForDynamic,
    } = this.state
    if (!staticRows && chooseRows === 'static') {
      return
    }
    if (!rows && chooseRows === 'dynamic') {
      return
    }

    if (chooseRows === 'static') {
      currentRowsForSort = staticRows
      currentRowsForSortText = 'staticRows'
      currentSort = currentSortForStatic
      currentSortText = 'currentSortForStatic'
    } else {
      currentRowsForSort = rows
      currentRowsForSortText = 'rows'
      currentSort = currentSortForDynamic
      currentSortText = 'currentSortForDynamic'
    }

    const stringKey = key === 'exchange' || key === 'symbol'

    const newData = currentRowsForSort.slice().sort((a: IRow, b: IRow) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          this.setState({ [currentSortText]: { key, arg: 'DESC' } })

          if (stringKey) {
            return onSortStrings(b[key], a[key])
          }

          return b[key] - a[key]
        } else {
          this.setState({ [currentSortText]: { key, arg: 'ASC' } })

          if (stringKey) {
            return onSortStrings(a[key], b[key])
          }

          return a[key] - b[key]
        }
      }
      this.setState({ [currentSortText]: { key, arg: 'ASC' } })

      if (stringKey) {
        return onSortStrings(a[key], b[key])
      }

      return a[key] - b[key]
    })

    this.setState({ [currentRowsForSortText]: newData })
  }

  render() {
    console.log('RENDER')

    const { children, isUSDCurrently } = this.props
    const {
      selectedActive,
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
    } = this.state
    const saveButtonColor =
      isPercentSumGood && undistributedMoney >= 0 ? '#4caf50' : '#f44336'
    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" />
    ) : (
      <Icon className="fa fa-btc" />
    )

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
      <PTWrapper tableData={this.state.rows}>
        {children}
        <Content>
        <Container>
          <TableAndHeadingWrapper>
            <TableHeading>Current portfolio</TableHeading>
            <Wrapper>
              <Table style={{ width: '520px' }}>
                <PTHead>
                  <PTR>
                    {tableHeadingsCurrentPortfolio.map((heading) => {
                      const isSorted =
                        currentSortForStatic &&
                        currentSortForStatic.key === heading.value

                      return (
                        <PTHC
                          key={heading.name}
                          onClick={() =>
                            this.onSortTable(heading.value, 'static')
                          }
                        >
                          {heading.name}

                          {isSorted && (
                            <SvgIcon
                              src={sortIcon}
                              width={12}
                              height={12}
                              style={{
                                verticalAlign: 'middle',
                                marginLeft: '4px',
                                transform:
                                  currentSortForStatic &&
                                  currentSortForStatic.arg === 'ASC'
                                    ? 'rotate(180deg)'
                                    : null,
                              }}
                            />
                          )}
                        </PTHC>
                      )
                    })}
                  </PTR>
                </PTHead>

                <PTBody>
                  {staticRows
                    .filter(
                      (row) =>
                        row.portfolioPerc &&
                        +row.portfolioPerc >
                          (this.props.filterValueSmallerThenPercentage
                            ? this.props.filterValueSmallerThenPercentage
                            : 0)
                    )
                    .map((row, idx) => {
                      const { exchange, symbol, portfolioPerc, price } = row

                      const cols = [
                        exchange,
                        symbol || '',
                        portfolioPerc ? `${portfolioPerc}%` : '',
                        `${parseFloat(price).toLocaleString('en-US')}`,
                      ]

                      return (
                        <PTR key={`${exchange}${symbol}${idx}`}>
                          {cols.map((col, index) => {
                            if (col.match(/%/g)) {
                              const color =
                                Number(col.replace(/%/g, '')) >= 0
                                  ? '#4caf50'
                                  : '#f44336'

                              return (
                                <PTDC key={`${col}${index}`} style={{ color }}>
                                  {col}
                                </PTDC>
                              )
                            }
                            if (index === 3) {
                              return (
                                <PTDC key={`${col}${idx}`}>
                                  {mainSymbol}
                                  {col}
                                </PTDC>
                              )
                            }

                            return <PTDC key={`${col}${index}`}>{col}</PTDC>
                          })}
                        </PTR>
                      )
                    })}
                </PTBody>
                <PTFoot>
                  <PTR>
                    <PTHC>All</PTHC>
                    <PTHC>-</PTHC>
                    <PTHC>100%</PTHC>
                    <PTHC>
                      {mainSymbol}
                      {`${parseFloat(totalStaticRows).toLocaleString('en-US')}`}
                    </PTHC>
                  </PTR>
                </PTFoot>
              </Table>
            </Wrapper>
          </TableAndHeadingWrapper>
          <TableAndHeadingWrapper isEditModeEnabled={isEditModeEnabled}>
            <TableHeading>
              Rebalanced portfolio
              <ActionButtonsContainer isEditModeEnabled={isEditModeEnabled}>
                <EditIconWrapper
                  onClick={this.onEditModeEnable}
                  isEditModeEnabled={isEditModeEnabled}
                >
                  {isEditModeEnabled ? <ClearIcon /> : <EditIcon />}
                </EditIconWrapper>
                <ActionButton onClick={this.onReset}>
                  <Replay />
                </ActionButton>
                <ActionButton onClick={this.onSaveClick}>
                  <SaveIcon style={{ color: saveButtonColor }} />
                </ActionButton>
                <ActionButton
                  onClick={this.onLoadPreviousClick}
                  style={{ display: 'none' }}
                >
                  <UndoIcon />
                </ActionButton>
              </ActionButtonsContainer>
            </TableHeading>
            <Wrapper>
              <Table>
                <PTHead isEditModeEnabled={isEditModeEnabled}>
                  <PTR>
                    {isEditModeEnabled && (
                      // !!undistributedMoney &&
                      <PTHR key="selectAll" style={{ textAlign: 'left' }}>
                        <Checkbox
                          onChange={this.onSelectAllActive}
                          checked={this.state.areAllActiveChecked}
                          type="checkbox"
                          id="selectAllActive"
                        />
                        <Label htmlFor="selectAllActive">
                          <Span />
                        </Label>
                      </PTHR>
                    )}

                    {tableHeadingsRebalancedPortfolio.map((heading) => {
                      const isSorted =
                        currentSortForDynamic &&
                        currentSortForDynamic.key === heading.value

                      return (
                        <PTHR
                          key={heading.name}
                          onClick={() =>
                            this.onSortTable(heading.value, 'dynamic')
                          }
                        >
                          {heading.name}

                          {isSorted && (
                            <SvgIcon
                              src={sortIcon}
                              width={12}
                              height={12}
                              style={{
                                verticalAlign: 'middle',
                                marginLeft: '4px',
                                transform:
                                  currentSortForDynamic &&
                                  currentSortForDynamic.arg === 'ASC'
                                    ? 'rotate(180deg)'
                                    : null,
                              }}
                            />
                          )}
                        </PTHR>
                      )
                    })}

                    {isEditModeEnabled && <PTHR />}
                  </PTR>
                </PTHead>

                <PTBody isEditModeEnabled={isEditModeEnabled}>
                  {rows.map((row, rowIndex) => {
                    const {
                      exchange,
                      symbol,
                      portfolioPerc,
                      price,
                      deltaPrice,
                    } = row

                    const isSelected =
                      (selectedActive &&
                        selectedActive.indexOf(rowIndex) >= 0) ||
                      false

                    let deltaPriceString = ''

                    // parseFloat(price).toLocaleString('en-US')

                    if (+deltaPrice) {
                      if (deltaPrice > 0) {
                        deltaPriceString = `BUY ${symbol}  $ ${parseFloat(
                          deltaPrice
                        ).toLocaleString('en-US')}`
                      } else {
                        deltaPriceString = `SELL ${symbol}  $ ${parseFloat(
                          Math.abs(deltaPrice).toLocaleString('en-US')
                        )}`
                      }
                    }

                    const cols = [
                      exchange,
                      symbol || '',
                      portfolioPerc ? `${portfolioPerc}%` : '',
                      `${parseFloat(price).toLocaleString('en-US')}`,
                      deltaPriceString,
                    ]

                    return (
                      <PTR key={`${rowIndex}`} isSelected={isSelected}>
                        {isEditModeEnabled && (
                          // !!undistributedMoney &&
                          <PTDR
                            key="smt"
                            isSelected={isSelected}
                            onClick={() => this.onSelectActiveBalance(rowIndex)}
                          >
                            {this.renderActiveCheckbox(rowIndex)}
                          </PTDR>
                        )}

                        {cols.map((col, idx) => {
                          const isNewCoinName =
                            row.editable && idx === 0 && isEditModeEnabled
                          const isNewCoinSymbol =
                            row.editable && idx === 1 && isEditModeEnabled

                          if (isNewCoinName) {
                            return (
                              <PTDR key={`NameExchange${idx}`} containSelect>
                                {/*<InputTable*/}
                                {/*key={`inputNameCoin${rowIndex}`}*/}
                                {/*isPercentSumGood={true}*/}
                                {/*value={this.state.rows[rowIndex].exchange}*/}
                                {/*onChange={(e) =>*/}
                                {/*this.onEditCoinName(e, rowIndex)*/}
                                {/*}*/}
                                {/*/>*/}
                                <SelectR
                                  key={`inputNameExchange${rowIndex}`}
                                  styles={customStyles}
                                  isClearable
                                  isSearchable
                                  options={exchangeOptions}
                                  menuPortalTarget={document.body}
                                  components={{ DropdownIndicator }}
                                  onChange={this.handleSelectChangeWithoutInputExchange.bind(
                                    this,
                                    rowIndex
                                  )}
                                />
                              </PTDR>
                            )
                          }

                          if (isNewCoinSymbol) {
                            return (
                              <PTDR key={`CoinSymbol${idx}`} containSelect>
                                {/*<InputTable*/}
                                {/*key={`inputCoinSymbol${rowIndex}`}*/}
                                {/*isPercentSumGood={true}*/}
                                {/*value={this.state.rows[rowIndex].symbol}*/}
                                {/*onChange={(e) =>*/}
                                {/*this.onEditCoinSymbol(e, rowIndex)*/}
                                {/*}*/}
                                {/*/>*/}
                                <SelectR
                                  key={`inputCoinSymbol${rowIndex}`}
                                  styles={customStyles}
                                  isClearable
                                  isSearchable
                                  options={coinsOptions}
                                  menuPortalTarget={document.body}
                                  components={{ DropdownIndicator }}
                                  onChange={this.handleSelectChangeWithoutInputCoin.bind(
                                    this,
                                    rowIndex
                                  )}
                                />
                              </PTDR>
                            )
                          }

                          if (idx === 2) {
                            const color =
                              Number(col.replace(/%/g, '')) >= 0
                                ? '#4caf50'
                                : '#f44336'
                            if (!this.state.isEditModeEnabled) {
                              return (
                                <PTDR key={`${col}${idx}`} style={{ color }}>
                                  {col}
                                </PTDR>
                              )
                            } else {
                              return (
                                <PTDR key={`percentageInCont${idx}`}>
                                  <InputTable
                                    key={`inputPercentage${rowIndex}`}
                                    tabIndex={rowIndex + 1}
                                    isPercentSumGood={isPercentSumGood}
                                    value={
                                      this.state.rows[rowIndex].portfolioPerc
                                    }
                                    onChange={(e) =>
                                      this.onPercentInputChange(e, rowIndex)
                                    }
                                    onBlur={(e) =>
                                      this.onBlurPercentInput(e, rowIndex)
                                    }
                                    onFocus={(e) =>
                                      this.onFocusPercentInput(e, rowIndex)
                                    }
                                  />
                                </PTDR>
                              )
                            }
                          }
                          if (col.match(/BUY/g)) {
                            const color = '#4caf50'

                            return (
                              <PTDR
                                key={`buy${idx}${col}${rowIndex}`}
                                style={{ color }}
                              >
                                {col}
                              </PTDR>
                            )
                          }
                          if (col.match(/SELL/g)) {
                            const color = '#f44336'

                            return (
                              <PTDR
                                key={`sell${idx}${col}${rowIndex}`}
                                style={{ color }}
                              >
                                {col}
                              </PTDR>
                            )
                          }

                          if (idx === 3) {
                            return (
                              <PTDR key={`${col}${idx}`}>
                                {mainSymbol}
                                {col}
                              </PTDR>
                            )
                          }

                          return <PTDR key={`${col}${idx}`}>{col}</PTDR>
                        })}
                        <PTDR>
                          <TableButton
                            isDeleteColor={false}
                            onClick={() => this.onDeleteRowClick(rowIndex)}
                          >
                            <DeleteIcon />
                          </TableButton>
                        </PTDR>
                      </PTR>
                    )
                  })}
                  {isEditModeEnabled && (
                    <PTR>
                      <PTDR />
                      <PTDR />
                      <PTDR />
                      <PTDR />
                      <PTDR />
                      <PTDR />
                      <PTDR>
                        <TableButton
                          isDeleteColor={true}
                          onClick={this.onAddRowButtonClick}
                        >
                          <AddIcon />
                        </TableButton>
                      </PTDR>
                    </PTR>
                  )}
                </PTBody>
                <PTFoot isEditModeEnabled={isEditModeEnabled}>
                  <PTR>
                    {isEditModeEnabled && <PTHR style={{ width: '38px' }} />}
                    <PTHR>Subtotal</PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>{`${totalPercents}%`}</PTHR>
                    <PTHR>
                      {mainSymbol}
                      {`${parseFloat(totalTableRows).toLocaleString('en-US')}`}
                    </PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>-</PTHR>
                  </PTR>
                  <PTR>
                    {isEditModeEnabled && <PTHR style={{ width: '38px' }} />}
                    <PTHR>All</PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>
                      {mainSymbol}
                      {`${parseFloat(totalRows).toLocaleString('en-US')}`}
                    </PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>-</PTHR>
                  </PTR>
                </PTFoot>
              </Table>
            </Wrapper>
            <ButtonsWrapper isEditModeEnabled={isEditModeEnabled}>
              <ButtonsInnerWrapper>
                <AddMoneyContainer>
                  <Input
                    type="number"
                    value={this.state.addMoneyInputValue}
                    onChange={this.onAddMoneyInputChange}
                    onFocus={this.onFocusAddMoneyInput}
                  />
                  <Button onClick={this.onAddMoneyButtonPressed}>
                    Add money
                  </Button>
                </AddMoneyContainer>
                <AddMoneyContainer>
                  <Button onClick={this.onDeleteUndistributedMoney}>
                    Delete undistributed
                  </Button>
                </AddMoneyContainer>
                {
                  <UndistributedMoneyContainer>
                    <UndistributedMoneyText>
                      Undistributed money:{' '}
                      {parseFloat(undistributedMoney).toLocaleString('en-US')}
                    </UndistributedMoneyText>
                    <Button
                      disabled={undistributedMoney < 0}
                      onClick={this.onDistribute}
                    >
                      Distribute to selected
                    </Button>
                  </UndistributedMoneyContainer>
                }
              </ButtonsInnerWrapper>
            </ButtonsWrapper>
          </TableAndHeadingWrapper>
        </Container>
        <ChartWrapper isEditModeEnabled={isEditModeEnabled}>
          <ChartColorPickerContainer>
            <input type="color" name="leftBar" onChange={this.onChangeColor} value={this.state.leftBar} />
            <input type="color" name="rightBar" onChange={this.onChangeColor} value={this.state.rightBar} />
          </ChartColorPickerContainer>
          <ChartContainer>
          <Chart>
            {staticRows[0].portfolioPerc && (
              <BarChart
                alwaysShowLegend
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

const Content = styled.div`
  overflow: auto;
  height: 100%;
  
  @media (min-height: 800px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  ${customAquaScrollBar};
`

const ChartWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  //padding: 3% 0;
  height: 25vh;
  padding: 20px;
  //height: 100%;
  justify-content: center;
  align-items: center;
    
  @media (max-height: 1200px) {
    height: 20vh;
    padding-bottom: 1.5%;
  }
  
  @media (max-height: 900px) {
    height: 15vh;
    padding-bottom: 1.5%;
  }
  
  @media (max-height: 800px) {
    height: 30vh;
    margin-top: 10%;
  }
`

const ChartContainer = styled.div`
    width: 1120px;
    height: inherit;
    background: #292d31;
    border-radius: 20px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    padding: 15px;
    
    @media (max-width: 1150px) {
      width: 100%;
    }
`

const Chart = styled.div`
  width: calc(100% - 15px);
  height: 100%;
  
  & > div {
    height: inherit;
  }
`

const ChartColorPickerContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  z-index: 2;
`

const InputTable = styled.input`
  max-width: 60px;
  background-color: #2d3136;
  border: none;
  outline: none;
  color: ${(props: { isPercentSumGood?: boolean }) =>
    props.isPercentSumGood ? '#fff' : '#f44336'};
`

const Icon = styled.i`
  padding-right: 5px;
`

const PTWrapper = styled.div`
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem);' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
`

const TableAndHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;

  &:not(:first-child) {
    min-height: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '55vh' : ''};
  }

  &:not(:first-child) {
    padding-left: 60px;
  }

  ${customAquaScrollBar};
`

const Wrapper = styled.div`
  overflow-y: scroll;
  padding-right: 2px;

  ${customAquaScrollBar};
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 45vh; //45vh
  padding: 0 20px 20px;
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
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

const PTD = css`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  white-space: nowrap;

  & svg {
    width: 15px;
    height: 15px;
  }
`

const PTDC = styled.td`
  ${PTD};
  min-width: 100px;
  overflow: hidden;

  &:nth-child(2) {
    min-width: 70px;
    text-align: left;
  }
  &:nth-child(3) {
    text-align: right;
  }
  &:nth-child(4) {
    text-align: right;
    min-width: 100px;
    &:hover {
      & svg {
        color: #ffffff;
      }
    }
  }
  &:nth-child(5) {
    text-align: right;
    min-width: 100px;
  }
  &:nth-child(6) {
    text-align: left;
    min-width: 150px;
  }
  &:nth-child(7) {
    padding: 1.75px 5px;
    min-width: 30px;
    text-align: left;
  }
`

const PTDREditMode = css`
  ${PTD};

  &:nth-child(1) {
    padding: 1.75px 10px;
  }

  &:nth-child(2) {
    min-width: 100px;
  }
  &:nth-child(3) {
    min-width: 100px;
  }
  &:nth-child(4) {
    text-align: right;
    min-width: 100px;
    &:hover {
      & svg {
        color: #ffffff;
      }
    }
  }
  &:nth-child(5) {
    text-align: right;
    min-width: 100px;
  }
  &:nth-child(6) {
    text-align: left;
    min-width: 150px;
  }
  &:nth-child(7) {
    padding: 1.75px 5px;
    min-width: 30px;
    text-align: left;
  }
`

const PTDRNoEditMode = css`
  min-width: 100px;

  &:nth-child(2) {
    min-width: 70px;
  }

  &:nth-child(3) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
    &:hover {
      & svg {
        color: #ffffff;
      }
    }
  }
  &:nth-child(5) {
    min-width: 150px;
  }
  &:nth-child(6) {
    display: none;
  }
`
const PTDR = styled.td`
  ${PTD};

  overflow: ${(props: { containSelect?: boolean }) =>
    props.containSelect ? 'visible' : 'hidden'};
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;
  
  & ${PTDR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? PTDREditMode : PTDRNoEditMode}
`

const PTH = css`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: left;
  font-weight: 500;
  position: relative;
  padding: 10px 16px 10px 10px;
`

const PTHC = styled.th`
  ${PTH};
  min-width: 100px;

  &:nth-child(2) {
    min-width: 70px;
    text-align: left;
  }
  &:nth-child(3),
  &:nth-child(4) {
    text-align: right;
  }
`
const PTHRNoEditMode = css`
  min-width: 100px;
  &:nth-child(1) {
  }

  &:nth-child(2) {
    text-align: left;
    min-width: 70px;
  }

  &:nth-child(3) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
  }

  &:nth-child(5) {
    min-width: 150px;
  }
  &:nth-child(6) {
    display: none;
  }
`
const PTHREditMode = css`
  &:nth-child(1) {
    padding: 10px;
    text-align: left;
  }

  &:nth-child(2) {
    text-align: left;
    min-width: 100px;
  }

  &:nth-child(3) {
    min-width: 100px;
  }

  &:nth-child(4),
  &:nth-child(5) {
    text-align: right;
    min-width: 100px;
  }
  &:nth-child(6) {
    text-align: left;
    min-width: 150px;
  }
  &:nth-child(7) {
    width: 30px;
    text-align: left;
    padding: 1.75px 5px;
  }
`

const PTHR = styled.th`
  ${PTH};
`

// const PTFR = styled.th`
//   ${PTH};
//   min-width: 100px;
//
//   &:nth-child(2) {
//     text-align: left;
//     min-width: 70px;
//   }
// `

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};

  & ${InputTable} {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3136' : '#393e44'};

    border: 1px solid #928282;
  }

  &:nth-child(even) {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }

  &:nth-child(even) ${InputTable} {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }
`

const PT = css`
  display: table;
  width: 100%;
  position: sticky;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`

const PTHead = styled.thead`
  ${PT};
  top: 0;


  & ${PTHR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? PTHREditMode : PTHRNoEditMode}
`

const PTFoot = styled.tfoot`
  ${PT};
  bottom: 0;
  
    &::before {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px solid white;
  }
  
  & ${PTHR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? PTHREditMode : PTHRNoEditMode}
`

const Span = styled.span``

const Label = styled.label``

const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 18px;

    height: 18px;

    cursor: pointer;
    vertical-align: middle;

    border: 1.5px solid #909294;
    border-radius: 3px;
    background-color: transparent;
  }

  & + ${Label}:hover ${Span} {
    border-color: #4ed8da;
  }

  &:checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

// const PieChartContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   height: 100%;
//   width: 33.3%;
//
//   margin: ${(props: { isEditModeEnabled?: boolean }) =>
//     props.isEditModeEnabled ? '0' : '0 auto'};
//
//   @media (max-height: 650px) {
//     display: none;
//   }
//
//   &:not(:first-child) {
//     display: ${(props: { isEditModeEnabled?: boolean }) =>
//       props.isEditModeEnabled ? 'none' : 'flex'};
//   }
//`

const ButtonsWrapper = styled.div`
  display: ${(props: { isEditModeEnabled?: boolean }) =>
    props.isEditModeEnabled ? 'block' : 'none'};
`

const ButtonsInnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Input = styled.input`
  box-sizing: border-box;
  border-bottom: 2px solid rgb(78, 216, 218);
  background: transparent;
  border-top: none;
  border-left: none;
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0px;
  color: rgb(255, 255, 255);
`

const TableButton = styled.button`
  border: none;
  margin: 0;
  padding: 1.75px 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  text-align: inherit;
  outline: none;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &:hover {
    & svg {
      color: ${(props: { isDeleteColor?: boolean }) =>
        props.isDeleteColor ? '#4caf50' : '#f44336'};
    }
  }
  & svg {
    width: 18px;
    height: 18px;
  }
`
const ActionButton = styled.button`
  border: none;
  margin: 0;
  padding: 1.75px 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  text-align: inherit;
  outline: none;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  & svg {
    color: white;
    padding-bottom: 7px;
  }

  &:hover svg {
    color: #4ed8da;
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  min-width: 150px;
  justify-content: space-around;
  padding-left: 10px;

  & ${ActionButton} {
    visibility: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? 'visible' : 'hidden'};
  }
`

const Button = styled.button`
  border-radius: 2px;
  background-color: #4c5055;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 10px;

  &:disabled {
    cursor: not-allowed;
    background-color: gray;
  }
`

const UndistributedMoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 120px;
`

const AddMoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 120px;
`

const UndistributedMoneyText = styled.p`
  font-family: Roboto, sans-serif;
  color: white;
  font-size: 14px;
  padding: 15px 0px 5px;
  margin: 0px;
`
const EditIconWrapper = styled.div`
  &:hover {
    color: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '#f44336' : '#4caf50'};
  }

  & svg {
    padding-bottom: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '4px' : '7px'};
  }
`

const PTextBox = styled.div`
  font-size: 30px;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3136;
`

const SelectR = styled(SelectReact)`
  max-width: 100px;
  font-family: Roboto;
  font-size: 12px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 1px solid #fff;
  }

  & + & {
    margin-left: 25px;
  }
`

const customStyles = {
  control: () => {
    return {
      position: 'relative',
      boxSizing: 'border-box',
      cursor: 'default',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      outline: '0',
      transition: 'all 100ms',
      backgroundColor: 'transparent',
      minHeight: '0.8em',
      border: 'none',
    }
  },
  menu: (base, state) => ({
    ...base,
    backgroundColor: '#424242',
    minWidth: '150px',
    maxHeight: '200px',
    height: '200px',
  }),
  // TODO: Delete maxheight or height
  menuList: (base, state) => ({
    ...base,
    maxHeight: '200px',
    height: '200px',
  }),
  option: (base, state) => ({
    ...base,
    color: '#fff',
    fontSize: '1.5em',
    fontFamily: 'Roboto',
    backgroundColor: state.isSelected
      ? 'rgba(255, 255, 255, 0.2)'
      : state.isFocused
        ? 'rgba(255, 255, 255, 0.1)'
        : '#424242',
    [':active']: null,
  }),
  clearIndicator: (base, state) => {
    return {
      [':hover']: {
        color: '#fff',
      },
      display: 'flex',
      width: '20px',
      boxSizing: 'border-box',
      color: 'hsl(0, 0%, 80%)',
      padding: '2px',
      transition: 'color 150ms',
    }
  },
  dropdownIndicator: (base, state) => ({
    [':hover']: {
      color: '#fff',
    },
    display: 'flex',
    width: '20px',
    boxSizing: 'border-box',
    color: 'hsl(0, 0%, 80%)',
    padding: '2px',
    transition: 'color 150ms',
  }),
  valueContainer: (base, state) => ({
    ...base,
    paddingLeft: 0,
  }),
  singleValue: (base, state) => ({
    ...base,
    color: '#fff',
    marginLeft: '0',
  }),
  placeholder: (base, state) => ({
    ...base,
    marginLeft: 0,
  }),
  input: (base, state) => ({
    ...base,
    color: '#fff',
  }),
  multiValue: (base, state) => ({
    ...base,
    [':hover']: {
      borderColor: '#4ed8da',
    },

    color: '#fff',
    borderRadius: '3px',
    fontWeight: 'bold',
    backgroundColor: '#2a2d32',
  }),
  multiValueLabel: (base, state) => ({
    ...base,
    color: '#fff',
  }),
  multiValueRemove: (base, state) => ({
    ...base,
    [':hover']: {
      color: '#fff',
      backgroundColor: '#4ed8da',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
}

const DropdownIndicator = (props) =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <SvgIcon
        src={dropDownIcon}
        width={19}
        height={19}
        style={{
          verticalAlign: 'middle',
        }}
      />
    </components.DropdownIndicator>
  )





const mapStateToProps = (store) => ({
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
)(PortfolioTableRebalance)
