import * as React from 'react'
import styled, { css } from 'styled-components'
import { IProps, IState, IRow } from './PortfolioTableRebalance.types'
import {
  tableData,
  combineToChart,
  PieChartMockFirst,
  PieChartMockSecond,
} from './mocks'
import { onSortStrings } from '../../../../../utils/PortfolioTableUtils'
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
import { IndProps } from '@containers/Portfolio/interfaces'
import SvgIcon from '../../../../../components/SvgIcon/SvgIcon'

const tableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'USD', value: 'price' },
]

const newTableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'USD', value: 'price' },
  { name: 'Trade', value: 'trade' },
]

export default class PortfolioTableRebalance extends React.Component<
  IProps,
  IState
> {
  state: IState = {
    selectedBalances: null,
    selectedActive: null,
    areAllChecked: false,
    areAllActiveChecked: false,
    rows: JSON.parse(JSON.stringify(tableData)),
    staticRows: JSON.parse(JSON.stringify(tableData)),
    savedRows: JSON.parse(JSON.stringify(tableData)),
    testRows: JSON.parse(JSON.stringify(tableData)),
    addMoneyInputValue: 0,
    activePercentInput: null,
    activePercentInputValues: [],
    currentSortForStatic: null,
    currentSortForDynamic: null,
    isEditModeEnabled: false,
    isUSDCurrently: true,
    undistributedMoney: 0,
    totalRows: 0,
    totalStaticRows: 0,
    totalSavedRows: 0,
    isPercentSumGood: true,
  }
  componentWillMount() {
    this.calculateAllTotals()
    setTimeout(() => {
      this.calculateAllPercents() //TODO: find better way to fix it
    }, 100)
  }
  componentDidMount() {
    document.addEventListener('keydown', this.escFunction)
  }

  calculateAllTotals = () => {
    this.setState({
      totalRows: this.calculateTotal(this.state.rows),
      totalStaticRows: this.calculateTotal(this.state.staticRows),
      totalSavedRows: this.calculateTotal(this.state.savedRows),
    })
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.isUSDCurrently !== this.props.isUSDCurrently) {
      this.setState({ isUSDCurrently: nextProps.isUSDCurrently })
      if (nextProps.isUSDCurrently) {
        tableHeadings[3].name = 'USD'
        newTableHeadings[3].name = 'USD'
      } else {
        tableHeadings[3].name = 'BTC'
        newTableHeadings[3].name = 'BTC'
      }
    }
  }

  calculateAllPercents = () => {
    this.setState({
      rows: this.calculatePercents(this.state.rows, this.state.totalRows),
      staticRows: this.calculatePercents(
        this.state.staticRows,
        this.state.totalStaticRows
      ),
      savedRows: this.calculatePercents(
        this.state.savedRows,
        this.state.totalSavedRows
      ),
    })
  }

  calculatePriceDifference = (data: any[]) => {
    let { staticRows } = this.state
    data.forEach((row, i) => {
      staticRows.forEach((staticRow, j) => {
        if (
          data[i].currency === staticRows[j].currency &&
          data[i].symbol === staticRows[j].symbol
        ) {
          data[i].deltaPrice = data[i].price - staticRows[j].price
        }
      })
    })

    return data
  }

  checkForChanges = (data: any[]) => {
    let { staticRows } = this.state
    let isHasChangesInPrice = false

    data.forEach((row, i) => {
      staticRows.forEach((staticRow, j) => {
        if (
          data[i].currency === staticRows[j].currency &&
          data[i].symbol === staticRows[j].symbol
        ) {
          console.log(data[i].portfolioPerc !== staticRows[j].portfolioPerc)
          if (data[i].portfolioPerc !== staticRows[j].portfolioPerc) {
            isHasChangesInPrice = true
          }
        }
      })
    })

    return isHasChangesInPrice
  }

  calculateTotal = (data: any[]) => {
    // const { undistributedMoney } = this.state

    // console.log('underst before: ' + undistributedMoney)

    let total = data.reduce((sum, row, i) => (sum += data[i].price), 0)

    // console.log('underst after: ' + undistributedMoney)
    //
    // console.log(total + undistributedMoney)

    return total
  }

  calculatePercents = (data: any[], total: number) => {
    if (total === 0) {
      return this.calculatePriceDifference(
        data.map((row) => {
          row.portfolioPerc = 0.0

          return row
        })
      )
    }

    let sum = 0
    let maxSum = 100
    let lastFlag = false
    let newDataWithPercents = data.map((row, i) => {
      row.portfolioPerc = Math.round(((row.price * 100) / total) * 100) / 100
      sum += row.portfolioPerc
      maxSum -= row.portfolioPerc
      if (Math.abs(maxSum) <= 0.02 && !lastFlag) {
        row.portfolioPerc += maxSum
        row.portfolioPerc = Math.round(row.portfolioPerc * 100) / 100
        sum += maxSum
        lastFlag = true
      }

      //TODO: SHOULD BE REFACTORED
      row.portfolioPerc = row.portfolioPerc.toFixed(1)
      return row
    })
    console.log('total', total)
    console.log('sum: ', sum)
    console.log('maxSum: ', maxSum)
    /*
      TODO:
      Sometimes sum of all percents isn't 100
      console.log(sum)
      Sometimes it is 99.99000000000001 or 100.0099999999999
      Have to be fixed
    */

    return this.calculatePriceDifference(newDataWithPercents)
  }

  // renderCheckbox = (idx: number) => {
  //   const { selectedBalances } = this.state
  //   const isSelected =
  //     (selectedBalances && selectedBalances.indexOf(idx) >= 0) || false
  //
  //   return (
  //     <React.Fragment>
  //       <Checkbox type="checkbox" id={idx} checked={isSelected} />
  //       <Label htmlFor={idx} onClick={(e) => e.preventDefault()}>
  //         <Span />
  //       </Label>
  //     </React.Fragment>
  //   )
  // }

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
    let rows = JSON.parse(JSON.stringify(this.state.rows))
    let { totalRows } = this.state
    let newRow = {
      currency: 'Newcoin',
      symbol: 'NEW',
      portfolioPerc: 0.0,
      price: 0,
    }
    rows.push(newRow)
    rows = this.calculatePercents(rows, totalRows)
    this.setState({ rows, areAllActiveChecked: false })
  }

  onDeleteRowClick = (idx: number) => {
    let rows = JSON.parse(JSON.stringify(this.state.rows))
    let { selectedActive, staticRows } = this.state
    let money = rows[idx].price
    // rows[rows.length - 1].undistributedMoney += money
    this.setState((prevState) => ({
      undistributedMoney: prevState.undistributedMoney + money,
    }))
    let deleteFlag = true
    this.state.staticRows.forEach((row, i, arr) => {
      if (
        rows[idx].currency == staticRows[i].currency &&
        rows[idx].symbol == staticRows[i].symbol
      ) {
        deleteFlag = false
      }
    })
    if (deleteFlag) {
      rows.splice(idx, 1)
      if (selectedActive) {
        let toRemove = -1
        selectedActive.forEach((row, i, arr) => {
          if (selectedActive[i] === idx) {
            toRemove = i
          } else {
            if (selectedActive[i] > idx) {
              selectedActive[i] -= 1
            }
          }
        })
        if (toRemove != -1) {
          selectedActive.splice(toRemove, 1)
        }
      }
    } else {
      rows[idx].price = 0
    }

    let newTotalRows = this.calculateTotal(rows)
    let newRowsWithNewPercents = this.calculatePercents(rows, newTotalRows)
    let newIsPercentSumGood = this.checkPercentSum(newRowsWithNewPercents)

    this.setState({
      selectedActive,
      totalRows: newTotalRows,
      rows: newRowsWithNewPercents,
      isPercentSumGood: newIsPercentSumGood,
    })
  }

  onSelectAllActive = (e: any) => {
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
  onSelectActiveBalance = (idx: number) => {
    const selectedActive =
      (this.state.selectedActive && this.state.selectedActive.slice()) || []
    let { areAllActiveChecked } = this.state
    const hasIndex = selectedActive.indexOf(idx)
    if (hasIndex >= 0) {
      selectedActive.splice(hasIndex, 1)
    } else {
      selectedActive.push(idx)
    }
    if (selectedActive.length === this.state.rows.length) {
      areAllActiveChecked = true
    } else {
      areAllActiveChecked = false
    }
    this.setState({ selectedActive, areAllActiveChecked })
  }

  // TODO: refactor all this stuff
  onSaveClick = (e: any) => {
    if (this.state.isPercentSumGood) {
      let { rows, totalRows, undistributedMoney } = this.state

      if (this.checkForChanges(rows)) {
        console.log('has changes')

        let sumTotal = totalRows
        rows.forEach((row, i) => {
          if (rows[i].portfolioPerc) {
            let newPrice = Math.round((totalRows / 100) * rows[i].portfolioPerc)
            console.log('newPrice: ', newPrice)
            if (sumTotal <= newPrice) {
              rows[i].price = newPrice
              sumTotal = 0
            } else {
              rows[i].price = newPrice
              sumTotal -= newPrice
            }
          }
        })

        rows = this.calculatePriceDifference(rows)
      }

      this.setState({
        savedRows: JSON.parse(JSON.stringify(this.state.rows)),
        rows,
        totalSavedRows: totalRows,
        isEditModeEnabled: false,
        undistributedMoney: 0,
      })
    }
  }
  onLoadPreviousClick = (e: any) => {
    this.setState({ rows: JSON.parse(JSON.stringify(this.state.savedRows)) })
    this.setState({
      totalRows: JSON.parse(JSON.stringify(this.state.totalSavedRows)),
    })
  }
  onReset = (e: any) => {
    this.setState({ rows: JSON.parse(JSON.stringify(this.state.staticRows)) })
    this.setState({
      totalRows: JSON.parse(JSON.stringify(this.state.totalStaticRows)),
    })
  }

  onDistribute = (e: any) => {
    let { selectedActive, rows, undistributedMoney } = this.state
    if (selectedActive && selectedActive.length > 0) {
      if (selectedActive.length > 1) {
        // let money = rows[rows.length - 1].undistributedMoney
        let money = undistributedMoney
        let moneyPart = Math.floor(money / selectedActive.length)
        selectedActive.forEach((row, i, arr) => {
          rows[selectedActive[i]].price += moneyPart
          money -= moneyPart
        })
        // rows[rows.length - 1].undistributedMoney = money
        this.setState({ undistributedMoney: money })
      } else {
        // rows[selectedActive[0]].price +=
        //   rows[rows.length - 1].undistributedMoney
        rows[selectedActive[0]].price += undistributedMoney

        // rows[rows.length - 1].undistributedMoney = 0
        this.setState({ undistributedMoney: 0 })
      }
      setTimeout(() => {
        let newTotal = this.calculateTotal(rows)
        rows = this.calculatePercents(rows, newTotal)
        this.setState({
          selectedActive,
          rows,
          totalRows: newTotal,
          isPercentSumGood: this.checkPercentSum(rows),
        }) //Very brutal fix, need to be reworked
      }, 100)
    }
  }

  onAddMoneyInputChange = (e: any) => {
    this.setState({ addMoneyInputValue: e.target.value })
  }

  checkPercentSum = (data) => {
    const sumOfAllPercents = data.reduce(
      (sum, row) => (sum += +row.portfolioPerc),
      0
    )

    // console.log(
    //   'checksum: ',
    //   sumOfAllPercents - 100 > 0.1,
    //   'sum of al perc: ',
    //   sumOfAllPercents,
    //   Math.abs(sumOfAllPercents - 100) > 0.1,
    //   'math abs : ',
    //   Math.abs(sumOfAllPercents - 100)
    // )

    return Math.abs(sumOfAllPercents - 100) <= 0.01
  }

  onBlurFunc = (e: any, idx: number) => {
    const { rows } = this.state
    let percentInput = e.target.value

    if (percentInput !== '') {
      return
    }
    percentInput = 0

    const clonedRows = rows.map((a) => ({ ...a }))
    clonedRows[idx].portfolioPerc = percentInput

    this.setState({
      rows: clonedRows,
    })
  }

  onTestFunc = (e: any, idx: number) => {
    const { rows } = this.state
    let percentInput = e.target.value

    if (
      !/^([0-9]\.?[1-9]?|(!?[1-9][0-9]\.[1-9]|[1-9][0-9]\.?)|100|)$/.test(
        percentInput
      )
    ) {
      return
    }

    const clonedRows = rows.map((a) => ({ ...a }))
    clonedRows[idx].portfolioPerc = percentInput

    this.setState({
      rows: clonedRows,
      isPercentSumGood: this.checkPercentSum(clonedRows),
    })
  }

  onPercentInputChange = (e: any, idx: number) => {
    // e.preventDefault()
    // let percentInput = e.target.value
    //
    // console.log(percentInput)
    // console.log(
    //   /^([0-9]([.][1-9])?|[1-9][0-9]([.][1-9])?|100|)$/.test(percentInput)
    // )
    //
    // if (!/^([0-9]([.][1-9])?|[1-9][0-9]([.][1-9])?|100|)$/.test(percentInput)) {
    //   console.log('not true')
    //
    //   return
    // }

    // //TODO: It should be in onFocusOut
    // if (percentInput === '') {
    //   percentInput = 0
    // }
    //
    // console.log(percentInput)
    //
    // let rows = this.state.rows.slice()
    // rows[idx].portfolioPerc = String(percentInput)
    //
    // this.setState({ rows }, () => {
    //   console.log(rows[idx])
    // })
    // this.setState({ isPercentSumGood: this.checkPercentSum(rows) })

    // e.preventDefault()
    // e.target.focus()
  }

  /* onPercentClick = (idx: number) => {
    this.setState({
      activePercentInput: idx,
      activePercentInputValue: this.state.rows[idx].portfolioPerc,
    })
  }

  onPercentSubmit = (e: any) => {
    let { rows, totalRows } = this.state
    let percent = this.state.activePercentInputValue
    let idx = this.state.activePercentInput
    if (percent != rows[idx].portfolioPerc) {
      let total = rows[rows.length - 1].price
      let newMoney = Math.round(total * percent / 100)
      let subMoney = newMoney - rows[idx].price
      rows[idx].price = newMoney
      // rows[rows.length - 1].undistributedMoney -= subMoney
      this.setState((prevState) => ({
        undistributedMoney: prevState.undistributedMoney - subMoney,
      }))
      rows = this.calculatePercents(rows, totalRows)
      this.setState({
        activePercentInput: null,
        activePercentInputValue: 0,
        rows,
      })
    } else {
      this.setState({
        activePercentInput: null,
        activePercentInputValue: 0,
      })
    }
    e.preventDefault()
  }
*/
  onAddMoneyButtonPressed = (e: any) => {
    if (this.state.addMoneyInputValue !== 0) {
      let { rows, totalRows, addMoneyInputValue } = this.state

      this.setState((prevState) => ({
        undistributedMoney:
          prevState.undistributedMoney + Number(addMoneyInputValue),
      }))

      // rows[rows.length - 1].undistributedMoney += Number(
      //   this.state.addMoneyInputValue
      // )
      setTimeout(() => {
        let newTotal = this.calculateTotal(rows)
        //rows = this.calculatePercents(rows, newTotal)
        this.setState({
          addMoneyInputValue: 0,
          rows,
          totalRows: newTotal,
        }) //Very brutal fix, need to be reworked
      }, 100)
    }
  }

  escFunction = (e) => {
    if (e.keyCode === 27 && this.state.isEditModeEnabled) {
      this.setState((prevState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
      }))
    }
  }
  onEditModeEnable = () => {
    if (this.state.isEditModeEnabled) {
      this.setState((prevState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
        totalRows: JSON.parse(JSON.stringify(this.state.totalSavedRows)),
        rows: JSON.parse(JSON.stringify(this.state.savedRows)),
      }))
    } else {
      this.setState((prevState) => ({
        isEditModeEnabled: !prevState.isEditModeEnabled,
      }))
    }
  }

  onSortTable = (key: Args, chooseRows) => {
    let currentRowsForSort
    let currentRowsForSortText
    let currentSort
    let currentSortText
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

    const stringKey = key === 'currency' || key === 'symbol'

    const newData = currentRowsForSort.slice().sort((a, b) => {
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
    const { children, isUSDCurrently } = this.props
    const {
      selectedBalances,
      selectedActive,
      currentSortForStatic,
      currentSortForDynamic,
      totalStaticRows,
      totalRows,
      isEditModeEnabled,
      undistributedMoney,
      isPercentSumGood,
    } = this.state
    const saveButtonColor = isPercentSumGood ? '#65c000' : '#ff687a'
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
                    {tableHeadings.map((heading) => {
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
                  {this.state.staticRows.map((row, idx) => {
                    const { currency, symbol, portfolioPerc, price } = row

                    const isSelected =
                      (selectedBalances &&
                        selectedBalances.indexOf(idx) >= 0) ||
                      false

                    const cols = [
                      currency,
                      symbol || '',
                      portfolioPerc ? `${portfolioPerc}%` : '',
                      `${price}`,
                    ]

                    return (
                      <PTR
                        key={`${currency}${symbol}${idx}`}
                        isSelected={isSelected}
                      >
                        {cols.map((col, index) => {
                          if (col.match(/%/g)) {
                            const color =
                              Number(col.replace(/%/g, '')) >= 0
                                ? '#65c000'
                                : '#ff687a'

                            return (
                              <PTDC
                                key={`${col}${index}`}
                                style={{ color }}
                                isSelected={isSelected}
                              >
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

                          return (
                            <PTDC
                              key={`${col}${index}`}
                              isSelected={isSelected}
                            >
                              {col}
                            </PTDC>
                          )
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
          <TableAndHeadingWrapper>
            <TableHeading>
              Rebalanced portfolio
              <ActionButtonsContainer isEditModeEnabled={isEditModeEnabled}>
                <EditIconWrapper
                  onClick={this.onEditModeEnable}
                  isEditModeEnabled={isEditModeEnabled}
                >
                  {isEditModeEnabled ? <ClearIcon /> : <EditIcon />}
                </EditIconWrapper>
                <ActionButton onClick={() => this.onReset()}>
                  <Replay />
                </ActionButton>
                <ActionButton onClick={() => this.onSaveClick()}>
                  <SaveIcon style={{ color: saveButtonColor }} />
                </ActionButton>
                <ActionButton onClick={() => this.onLoadPreviousClick()}>
                  <UndoIcon />
                </ActionButton>
              </ActionButtonsContainer>
            </TableHeading>
            <Wrapper>
              <Table>
                <PTHead isEditModeEnabled={isEditModeEnabled}>
                  <PTR>
                    {isEditModeEnabled &&
                      !!undistributedMoney && (
                        <PTHR key="selectAll" style={{ textAlign: 'left' }}>
                          <Checkbox
                            onChange={() => this.onSelectAllActive()}
                            checked={this.state.areAllActiveChecked}
                            type="checkbox"
                            id="selectAllActive"
                          />
                          <Label htmlFor="selectAllActive">
                            <Span />
                          </Label>
                        </PTHR>
                      )}

                    {newTableHeadings.map((heading) => {
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
                  {this.state.rows.map((row, rowIndex) => {
                    const {
                      currency,
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

                    if (deltaPrice) {
                      if (deltaPrice > 0) {
                        deltaPriceString = `BUY ${symbol} ${deltaPrice} $`
                      } else {
                        deltaPriceString = `SELL ${symbol} ${Math.abs(
                          deltaPrice
                        )} $`
                      }
                    }

                    const cols = [
                      currency,
                      symbol || '',
                      portfolioPerc ? `${portfolioPerc}%` : '',
                      `${price}`,
                      deltaPriceString,
                    ]

                    return (
                      <PTR
                        key={`${currency}${symbol}${rowIndex}`}
                        isSelected={isSelected}
                      >
                        {isEditModeEnabled &&
                          !!undistributedMoney && (
                            <PTDR
                              key="smt"
                              isSelected={isSelected}
                              onClick={() =>
                                this.onSelectActiveBalance(rowIndex)
                              }
                            >
                              {this.renderActiveCheckbox(rowIndex)}
                            </PTDR>
                          )}

                        {cols.map((col, idx) => {
                          if (idx === 2) {
                            const color =
                              Number(col.replace(/%/g, '')) >= 0
                                ? '#65c000'
                                : '#ff687a'
                            if (!this.state.isEditModeEnabled) {
                              return (
                                <PTDR key={`${col}${idx}`} style={{ color }}>
                                  {col}
                                </PTDR>
                              )
                            } else {
                              return (
                                <PTDR key={`input${idx}`}>
                                  <InputTable
                                    key={`${rowIndex}`}
                                    isPercentSumGood={isPercentSumGood}
                                    value={
                                      this.state.rows[rowIndex].portfolioPerc
                                    }
                                    onChange={(e) =>
                                      this.onTestFunc(e, rowIndex)
                                    }
                                    onBlur={(e) => this.onBlurFunc(e, rowIndex)}
                                  />
                                </PTDR>
                              )
                            }
                          }
                          if (col.match(/BUY/g)) {
                            const color = '#65c000'

                            return <PTDR style={{ color }}>{col}</PTDR>
                          }
                          if (col.match(/SELL/g)) {
                            const color = '#ff687a'

                            return <PTDR style={{ color }}>{col}</PTDR>
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
                  {this.state.isEditModeEnabled && (
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
                          onClick={() => this.onAddRowButtonClick()}
                        >
                          <AddIcon />
                        </TableButton>
                      </PTDR>
                    </PTR>
                  )}
                </PTBody>
                <PTFoot isEditModeEnabled={isEditModeEnabled}>
                  <PTR>
                    {isEditModeEnabled &&
                      !!undistributedMoney && (
                        <PTHR style={{ width: '38px' }} />
                      )}
                    <PTHR>All</PTHR>
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
                  />
                  <Button onClick={() => this.onAddMoneyButtonPressed()}>
                    Add money
                  </Button>
                </AddMoneyContainer>
                {undistributedMoney !== 0 && (
                  <UndistributedMoneyContainer>
                    <UndistributedMoneyText>
                      Undistributed money: {undistributedMoney}
                    </UndistributedMoneyText>
                    <Button onClick={() => this.onDistribute()}>
                      Distribute to selected
                    </Button>
                  </UndistributedMoneyContainer>
                )}
              </ButtonsInnerWrapper>
            </ButtonsWrapper>
          </TableAndHeadingWrapper>
        </Container>
        <PieChartsWrapper>
          <PieChartContainer>
            <PieChart
              data={combineToChart(PieChartMockFirst)}
              flexible={true}
            />
          </PieChartContainer>

          <PieChartContainer>
            <PieChart
              data={combineToChart(PieChartMockSecond)}
              flexible={true}
            />
          </PieChartContainer>
        </PieChartsWrapper>
      </PTWrapper>
    )
  }
}

const InputTable = styled.input`
  max-width: 60px;
  background-color: #2d3136;
  border: none;
  outline: none;
  color: ${(props: { isPercentSumGood?: boolean }) =>
    props.isPercentSumGood ? 'white' : 'red'};
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
  height: 200vh; //45vh
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
  font-family: Roboto;
  font-size: 17px;
  color: white;
  font-weight: bold;
  letter-spacing: 1.1px;
  min-height: 25px;
`

const PTD = css`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
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
  ${PTD} min-width: 100px;

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
  font-family: Roboto;
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

const PTFR = styled.th`
  ${PTH};
  min-width: 100px;

  &:nth-child(2) {
    text-align: left;
    min-width: 70px;
  }
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};

  & ${InputTable} {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3136' : '#393e44'};

    border: 1px solid indianred;
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

const PTHead = styled.thead`
  display: table;
  width: 100%;
  position: sticky;
  top: 0;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }

  & ${PTHR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? PTHREditMode : PTHRNoEditMode}
`

const PTFoot = styled.thead`
  display: table;
  width: 100%;
  position: sticky;
  bottom: 0;

  &::after {
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
  justify-content: space-between;
  padding: 3% 0;
  width: 100%;
  height: 25vh;

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
  margin: 0 auto;

  @media (max-height: 650px) {
    display: none;
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
  font-family: Roboto;
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
        props.isDeleteColor ? '#65c000' : '#ff687a'};
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

const Button = styled.div`
  border-radius: 2px;
  background-color: #4c5055;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 10px;
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
  font-family: Roboto;
  color: white;
  font-size: 14px;
  padding: 15px 0px 5px;
  margin: 0px;
`
const EditIconWrapper = styled.div`
  &:hover {
    color: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '#ff687a' : '#65c000'};
  }

  & svg {
    padding-bottom: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '4px' : '7px'};
  }
`
