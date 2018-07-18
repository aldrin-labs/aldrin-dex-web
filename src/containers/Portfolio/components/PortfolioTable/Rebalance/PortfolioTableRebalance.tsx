import * as React from 'react'
import styled, { css } from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import { IProps, IState, IRow } from './PortfolioTableRebalance.types'
import { mockTableData, combineToChart } from './mocks'
import {
  onSortStrings,
  cloneArrayElementsOneLevelDeep,
} from '@utils/PortfolioTableUtils'

import PieChart from '@components/PieChart'
import sortIcon from '@icons/arrow.svg'

import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import SaveIcon from 'material-ui-icons/Save'
import UndoIcon from 'material-ui-icons/Undo'
import EditIcon from 'material-ui-icons/Edit'
import Replay from 'material-ui-icons/Replay'
import ClearIcon from 'material-ui-icons/Clear'
import { Args } from '../types'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import spinLoader from '@icons/tail-spin.svg'

import { getMyPortfolioData, updateRebalanceMutation } from './api'

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
  }

  componentWillMount() {
    // this.calculateAllTotals()
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction)

    const { data, isShownMocks } = this.props

    // console.log('data in componentDidMount' + '', data)

    const userHasRebalancePortfolio =
      data &&
      data.myRebalance &&
      data.myRebalance.assets &&
      data.myRebalance.assets.length > 0
    const userHasPortfolio = data && data.portfolio.assets.length > 0
    let newTableRebalancedPortfolioData = []
    let newTableCurrentPortfolioData = []

    if (userHasRebalancePortfolio) {
      newTableRebalancedPortfolioData = data.myRebalance.assets.map((el) => ({
        exchange: el._id.exchange,
        symbol: el._id.coin,
        price: parseFloat(el.amount['$numberDecimal']).toFixed(2),
      }))

      newTableCurrentPortfolioData = data.portfolio.assets.map((el) => ({
        exchange: el.exchange.name,
        symbol: el.asset.symbol,
        price: (parseFloat(el.asset.priceUSD) * parseFloat(el.value)).toFixed(2),
      }))

      console.log('newTableRebalancedPortfolioData in didMount', newTableRebalancedPortfolioData)
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = data.portfolio.assets.map((el) => ({
        exchange: el.exchange.name,
        symbol: el.asset.symbol,
        price: (parseFloat(el.asset.priceUSD) * parseFloat(el.value)).toFixed(2),
      }))

      console.log('132323')
    }

    const composeWithMocksCurrentPortfolio = isShownMocks
      ? [...newTableCurrentPortfolioData, ...mockTableData]
      : newTableCurrentPortfolioData

    const composeWithMocksRebalancedPortfolio = isShownMocks
      ? [...newTableRebalancedPortfolioData, ...mockTableData]
      : newTableRebalancedPortfolioData

    if (userHasRebalancePortfolio) {
      this.setTableData(composeWithMocksCurrentPortfolio, composeWithMocksRebalancedPortfolio)
    }
    else {
      this.setTableData(composeWithMocksCurrentPortfolio, composeWithMocksCurrentPortfolio)
    }

    // const composeWithMocks = isShownMocks
    //   ? [...newTableData, ...mockTableData]
    //   : newTableData
    //
    // this.setTableData(composeWithMocks)
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { data, isShownMocks } = nextProps

    // console.log('data in componentWillReceiveProps', data)

    const userHasRebalancePortfolio =
      data &&
      data.myRebalance &&
      data.myRebalance.assets &&
      data.myRebalance.assets.length > 0
    const userHasPortfolio = data && data.portfolio.assets.length > 0
    let newTableRebalancedPortfolioData = []
    let newTableCurrentPortfolioData = []


    if (userHasRebalancePortfolio) {
      newTableRebalancedPortfolioData = data.myRebalance.assets.map((el) => ({
        exchange: el._id.exchange,
        symbol: el._id.coin,
        price: parseFloat(el.amount['$numberDecimal']).toFixed(2),
      }))

      newTableCurrentPortfolioData = data.portfolio.assets.map((el) => ({
        exchange: el.exchange.name,
        symbol: el.asset.symbol,
        price: (parseFloat(el.asset.priceUSD) * parseFloat(el.value)).toFixed(2),
      }))

      console.log('newTableRebalancedPortfolioData in didMount', newTableRebalancedPortfolioData)
    }

    if (!userHasRebalancePortfolio && userHasPortfolio) {
      newTableCurrentPortfolioData = data.portfolio.assets.map((el) => ({
        exchange: el.exchange.name,
        symbol: el.asset.symbol,
        price: (parseFloat(el.asset.priceUSD) * parseFloat(el.value)).toFixed(2),
      }))

      console.log('132323')
    }

    const composeWithMocksCurrentPortfolio = isShownMocks
      ? [...newTableCurrentPortfolioData, ...mockTableData]
      : newTableCurrentPortfolioData

    const composeWithMocksRebalancedPortfolio = isShownMocks
      ? [...newTableRebalancedPortfolioData, ...mockTableData]
      : newTableRebalancedPortfolioData

    if (userHasRebalancePortfolio) {
      this.setTableData(composeWithMocksCurrentPortfolio, composeWithMocksRebalancedPortfolio)
    }
    else {
      this.setTableData(composeWithMocksCurrentPortfolio, composeWithMocksCurrentPortfolio)
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

    console.log('data in caluclatePriceDiff' , data);


    return data
  }

  calculateTotal = (data: IRow[], undistributedMoney: number) => {
    const total = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

    return parseFloat(total + undistributedMoney).toFixed(2)
  }

  calculateTableTotal = (data: IRow[]) => {
    const tableTotal = data.reduce((sum, row, i) => (sum += +data[i].price), 0)

    return parseFloat(tableTotal)
      .toFixed(2)
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
        +row.price === 0 ? '0' : ((row.price * 100) / total).toFixed(4)
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
      exchange: 'Newcoin',
      symbol: 'NEW',
      portfolioPerc: 0.0,
      price: 0,
      editable: true,
    }
    rows.push(newRow)
    rows = this.calculatePercents(rows, totalRows)
    this.setState({ rows, areAllActiveChecked: false })
  }

  onDeleteRowClick = (idx: number) => {
    const { rows, undistributedMoney } = this.state
    const clonedRows = rows.map((a) => ({ ...a }))
    const currentRowMoney = clonedRows[idx].price

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        price: 0,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    const newUndistributedMoney = (parseFloat(undistributedMoney) + parseFloat(currentRowMoney)).toFixed(2)

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
      let newPrice = ((totalRows / 100) * row.portfolioPerc).toFixed(2)

      return {
        ...row,
        price: newPrice,
      }
    })

    return dataWithNewPrices
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
    if (undistributedMoney < 0) {
      return
    }

    const rowsWithNewPrice = this.calculatePriceByPercents(rows)
    const newRows = this.calculatePriceDifference(rowsWithNewPrice)


    this.setState({
      savedRows: cloneArrayElementsOneLevelDeep(newRows),
      rows: newRows,
      totalSavedRows: totalRows,
      isEditModeEnabled: false,
      selectedActive: [],
      areAllActiveChecked: false,
      undistributedMoneySaved: undistributedMoney,
    }, () => {
      this.updateServerDataOnSave()
    })
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

    console.log(combinedRowsData);


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
        console.log('roundedPrice', roundedPrice, 'typeof roundedPrice', typeof roundedPrice);
        console.log('undistributedMoney', undistributedMoney, 'typeof undistributedMoney', typeof undistributedMoney);

        rows![selectedActive![0]]!.price = roundedPrice + parseFloat(undistributedMoney)
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

    console.log('sumOfAllPercents: ', sumOfAllPercents, 'is good sum: ',Math.abs(sumOfAllPercents - 100) <= 0.001 || sumOfAllPercents === 0 );


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
          undistributedMoney: parseFloat(prevState.undistributedMoney) + oldNewPriceDiff,
          totalTableRows: newTableTotalRows,
        }))
        // }
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

    const newUndistributedMoney =
      (Number(undistributedMoney) + Number(addMoneyInputValue)).toFixed(2)

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
    console.log('dataFromServer in render: ', this.props.data)
    console.log('this.state.undistributedMoney: ', this.state.undistributedMoney)

    //
    // const { data } = this.props
    // // const { getProfile, loading, error } = data
    //
    // if (loading) {
    //   return (
    //     <LoaderWrapper>
    //       <SvgIcon
    //         src={spinLoader}
    //         width={48}
    //         height={48}
    //         style={{
    //           position: 'absolute',
    //           left: 'calc(50% - 48px)',
    //           top: 'calc(50% - 48px)',
    //         }}
    //       />
    //     </LoaderWrapper>
    //   )
    // }

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

    return (
      <PTWrapper tableData={this.state.rows}>
        {children}
        <Container>
          <TableAndHeadingWrapper>
            <TableHeading>Current portfolio</TableHeading>
            <Wrapper>
              <Table>
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
                  {staticRows.map((row, idx) => {
                    const { exchange, symbol, portfolioPerc, price } = row

                    const cols = [
                      exchange,
                      symbol || '',
                      portfolioPerc ? `${portfolioPerc}%` : '',
                      `${price}`,
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
                    <PTHC>-</PTHC>
                    <PTHC>
                      {mainSymbol}
                      {`${totalStaticRows}`}
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

                    if (+deltaPrice) {
                      if (deltaPrice > 0) {
                        deltaPriceString = `BUY ${symbol} ${deltaPrice} $`
                      } else {
                        deltaPriceString = `SELL ${symbol} ${Math.abs(
                          deltaPrice
                        )} $`
                      }
                    }

                    const cols = [
                      exchange,
                      symbol || '',
                      portfolioPerc ? `${portfolioPerc}%` : '',
                      `${price}`,
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
                              <PTDR key={`NameCoin${idx}`}>
                                <InputTable
                                  key={`inputNameCoin${rowIndex}`}
                                  isPercentSumGood={true}
                                  value={this.state.rows[rowIndex].exchange}
                                  onChange={(e) =>
                                    this.onEditCoinName(e, rowIndex)
                                  }
                                />
                              </PTDR>
                            )
                          }

                          if (isNewCoinSymbol) {
                            return (
                              <PTDR key={`CoinSymbol${idx}`}>
                                <InputTable
                                  key={`inputCoinSymbol${rowIndex}`}
                                  isPercentSumGood={true}
                                  value={this.state.rows[rowIndex].symbol}
                                  onChange={(e) =>
                                    this.onEditCoinSymbol(e, rowIndex)
                                  }
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
                    <PTHR>All</PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>{`${totalPercents}%`}</PTHR>
                    <PTHR>
                      {mainSymbol}
                      {`${totalTableRows}`}
                    </PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>-</PTHR>
                  </PTR>
                  <PTR>
                    {isEditModeEnabled && <PTHR style={{ width: '38px' }} />}
                    <PTHR>Subtotal</PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>-</PTHR>
                    <PTHR>
                      {mainSymbol}
                      {`${totalRows}`}
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
                      Undistributed money: {undistributedMoney}
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
        <PieChartsWrapper isEditModeEnabled={isEditModeEnabled}>
          <PieChartContainer isEditModeEnabled={isEditModeEnabled}>
            <PieChart
              data={combineToChart(staticRows)}
              flexible={true}
              withHints={true}
            />
          </PieChartContainer>

          <PieChartContainer isEditModeEnabled={isEditModeEnabled}>
            <PieChart
              data={combineToChart(rows)}
              flexible={true}
              withHints={true}
            />
          </PieChartContainer>
        </PieChartsWrapper>
      </PTWrapper>
    )
  }
}

const mapStateToProps = (store) => ({
  isShownMocks: store.user.isShownMocks,
})

export default compose(
  connect(mapStateToProps)
  // graphql(updateRebalanceMutation, {name: 'updateRebalance'})
)(PortfolioTableRebalance)

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
    padding-left: 30px;
  }

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

const Wrapper = styled.div`
  overflow-y: scroll;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 45vh; //45vh
  padding: 0 20px 20px;
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
  width: 45vw;
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
  overflow: hidden;
  white-space: nowrap;

  & svg {
    width: 15px;
    height: 15px;
  }
`

const PTDC = styled.td`
  ${PTD};
  min-width: 100px;

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
  ${PTD} &:nth-child(1) {
    padding: 1.75px 10px;
  }

  &:nth-child(2) {
    min-width: 100px;
  }
  &:nth-child(3) {
    min-width: 70px;
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
    min-width: 70px;
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

const PieChartsWrapper = styled.div`
  display: flex;
  justify-content: ${(props: { isEditModeEnabled?: boolean }) =>
    props.isEditModeEnabled ? 'center' : 'space-between'};
  padding: 3% 0;
  height: 25vh;
  width: ${(props: { isEditModeEnabled?: boolean }) =>
    props.isEditModeEnabled ? '50%' : '100%'};

  @media (max-height: 800px) {
    padding-top: 1.5%;
  }
  @media (max-height: 650px) {
    justify-content: center;
  }
`

const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 33.3%;

  margin: ${(props: { isEditModeEnabled?: boolean }) =>
    props.isEditModeEnabled ? '0' : '0 auto'};

  @media (max-height: 650px) {
    display: none;
  }

  &:not(:first-child) {
    display: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? 'none' : 'flex'};
  }
`

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

const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 24px;
  position: relative;
`
