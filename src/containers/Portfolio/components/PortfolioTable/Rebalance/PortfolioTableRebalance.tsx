import * as React from 'react'
import styled from 'styled-components'
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
import CompareArrows from 'material-ui-icons/CompareArrows'
import { Args } from '../types'
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
    addMoneyInputValue: 0,
    activePercentInput: null,
    activePercentInputValue: 0,
    currentSortForStatic: null,
    currentSortForDynamic: null,
    isEditModeEnabled: false,
    undistributedMoney: 0,
    totalRows: 0,
    totalStaticRows: 0,
    totalSavedRows: 0,
  }
  componentWillMount() {
    this.calculateAllPercents()
    this.calculateAllTotals()
  }

  calculateAllTotals = () => {
    this.setState({
      totalRows: this.calculateTotal(this.state.rows),
      totalStaticRows: this.calculateTotal(this.state.staticRows),
      totalSavedRows: this.calculateTotal(this.state.savedRows),
    })
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

  calculateTotal = (data: any[]) => {
    const { undistributedMoney } = this.state
    let total = data.reduce(
      (sum, row, i) => (sum += data[i].price),
      undistributedMoney
    )

    console.log(total)

    return total
  }

  calculatePercents = (data: any[], total) => {
    let newDataWithPercents = data.map((row, i) => {
      row[i] = Math.ceil(data[i].price * 100 / total * 100) / 100

      // TODO: FIX WHY INFINITY??
      // console.log(
      //   'percantage:' + Math.ceil(data[i].price * 100 / total * 100) / 100
      // )
      return row
    })

    console.log(data)
    console.log(newDataWithPercents)

    return this.calculatePriceDifference(newDataWithPercents)
  }

  renderCheckbox = (idx: number) => {
    const { selectedBalances } = this.state
    const isSelected =
      (selectedBalances && selectedBalances.indexOf(idx) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={idx} checked={isSelected} />
        <Label htmlFor={idx} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
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

  onButtonClick = (idx: number) => {
    let rows = JSON.parse(JSON.stringify(this.state.rows))
    let {
      selectedActive,
      areAllActiveChecked,
      staticRows,
      totalRows,
    } = this.state
    if (rows.length - 1 === idx) {
      let newRow = {
        currency: 'Newcoin',
        symbol: 'NEW',
        portfolioPerc: 0.0,
        price: 0,
      }
      rows.splice(rows.length - 1, 0, newRow)
      areAllActiveChecked = false
    } else {
      let money = rows[idx].price
      rows[rows.length - 1].undistributedMoney += money
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
          if (selectedActive.length >= rows.length - 1) {
            areAllActiveChecked = true
          } else {
            areAllActiveChecked = false
          }
        }
      } else {
        rows[idx].price = 0
      }
    }
    rows = this.calculatePercents(rows, totalRows)
    this.setState({ rows, selectedActive, areAllActiveChecked })
  }

  onSelectAll = (e: any) => {
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []
    let { areAllChecked } = this.state
    if (selectedBalances.length >= this.state.staticRows.length - 1) {
      selectedBalances.splice(0, selectedBalances.length)
      areAllChecked = false
    } else {
      selectedBalances.splice(0, selectedBalances.length)
      this.state.staticRows.map((a, i) => {
        if (i < this.state.staticRows.length - 1) {
          selectedBalances.push(i)
        }
      })
      areAllChecked = true
    }
    this.setState({ selectedBalances, areAllChecked })
  }
  onSelectAllActive = (e: any) => {
    const selectedActive =
      (this.state.selectedActive && this.state.selectedActive.slice()) || []
    let { areAllActiveChecked } = this.state
    if (selectedActive.length >= this.state.rows.length - 1) {
      selectedActive.splice(0, selectedActive.length)
      areAllActiveChecked = false
    } else {
      selectedActive.splice(0, selectedActive.length)
      this.state.rows.map((a, i) => {
        if (i < this.state.rows.length - 1) {
          selectedActive.push(i)
        }
      })
      areAllActiveChecked = true
    }
    this.setState({ selectedActive, areAllActiveChecked })
  }

  onSelectBalance = (idx: number) => {
    if (idx < this.state.staticRows.length - 1) {
      const selectedBalances =
        (this.state.selectedBalances && this.state.selectedBalances.slice()) ||
        []
      let { areAllChecked } = this.state
      const hasIndex = selectedBalances.indexOf(idx)
      if (hasIndex >= 0) {
        selectedBalances.splice(hasIndex, 1)
      } else {
        selectedBalances.push(idx)
      }
      if (selectedBalances.length >= this.state.staticRows.length - 1) {
        areAllChecked = true
      } else {
        areAllChecked = false
      }
      this.setState({ selectedBalances, areAllChecked })
    }
  }
  onSelectActiveBalance = (idx: number) => {
    if (idx < this.state.rows.length - 1) {
      const selectedActive =
        (this.state.selectedActive && this.state.selectedActive.slice()) || []
      let { areAllActiveChecked } = this.state
      const hasIndex = selectedActive.indexOf(idx)
      if (hasIndex >= 0) {
        selectedActive.splice(hasIndex, 1)
      } else {
        selectedActive.push(idx)
      }
      if (selectedActive.length >= this.state.rows.length - 1) {
        areAllActiveChecked = true
      } else {
        areAllActiveChecked = false
      }
      this.setState({ selectedActive, areAllActiveChecked })
    }
  }
  onSaveClick = (e: any) => {
    this.setState({ savedRows: JSON.parse(JSON.stringify(this.state.rows)) })
  }
  onLoadClick = (e: any) => {
    this.setState({ rows: JSON.parse(JSON.stringify(this.state.savedRows)) })
  }
  onReset = (e: any) => {
    this.setState({ rows: JSON.parse(JSON.stringify(this.state.staticRows)) })
  }

  onDistribute = (e: any) => {
    let { selectedActive, rows, totalRows } = this.state
    if (selectedActive && selectedActive.length > 0) {
      if (selectedActive.length > 1) {
        let money = rows[rows.length - 1].undistributedMoney
        let moneyPart = Math.floor(money / selectedActive.length)
        selectedActive.forEach((row, i, arr) => {
          rows[selectedActive[i]].price += moneyPart
          money -= moneyPart
        })
        rows[rows.length - 1].undistributedMoney = money
      } else {
        rows[selectedActive[0]].price +=
          rows[rows.length - 1].undistributedMoney
        rows[rows.length - 1].undistributedMoney = 0
      }
      rows = this.calculatePercents(rows, totalRows)
      this.setState({ selectedActive, rows })
    }
  }

  onAddMoneyInputChange = (e: any) => {
    this.setState({ addMoneyInputValue: e.target.value })
  }

  onPercentInputChange = (e: any) => {
    this.setState({ activePercentInputValue: e.target.value })
  }

  onPercentClick = (idx: number) => {
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
      rows[rows.length - 1].undistributedMoney -= subMoney
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

  onAddMoneyButtonPressed = (e: any) => {
    if (this.state.addMoneyInputValue !== 0) {
      let { rows, totalRows } = this.state
      rows[rows.length - 1].undistributedMoney += Number(
        this.state.addMoneyInputValue
      )
      rows = this.calculatePercents(rows, totalRows)
      this.setState({
        addMoneyInputValue: 0,
        rows,
      })
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
    const { children } = this.props
    const {
      selectedBalances,
      selectedActive,
      currentSortForStatic,
      currentSortForDynamic,
      totalRows,
    } = this.state

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
                      <PTH
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
                      </PTH>
                    )
                  })}
                </PTR>
              </PTHead>

              <PTBody>
                {this.state.staticRows.map((row, idx) => {
                  const { currency, symbol, portfolioPerc, price } = row

                  const isSelected =
                    (selectedBalances && selectedBalances.indexOf(idx) >= 0) ||
                    false

                  const cols = [
                    currency,
                    symbol || '',
                    portfolioPerc ? `${portfolioPerc}%` : '',
                    `${price} $`,
                  ]

                  return (
                    <PTR
                      key={`${currency}${symbol}${idx}`}
                      isSelected={isSelected}
                      // onClick={() => this.onSelectBalance(idx)}
                    >
                      {cols.map((col, index) => {
                        if (col.match(/%/g)) {
                          const color =
                            Number(col.replace(/%/g, '')) >= 0
                              ? '#65c000'
                              : '#ff687a'

                          return (
                            <PTD
                              key={`${col}${index}`}
                              style={{ color }}
                              isSelected={isSelected}
                            >
                              {col}
                            </PTD>
                          )
                        }

                        return (
                          <PTD key={`${col}${index}`} isSelected={isSelected}>
                            {col}
                          </PTD>
                        )
                      })}
                    </PTR>
                  )
                })}
              </PTBody>
              <PTFoot>
                <PTR>
                  <PTH>All</PTH>
                  <PTH>-</PTH>
                  <PTH>-</PTH>
                  <PTH>{`${totalRows} $`}</PTH>
                </PTR>
              </PTFoot>
            </Table>
          </Wrapper>
          </TableAndHeadingWrapper>
          <ActionButton onClick={() => this.onReset()}>
            <CompareArrows />
          </ActionButton>
          <TableAndHeadingWrapper>
            <TableHeading>Rebalanced portfolio</TableHeading>
          <Wrapper>
            <Table>
              <PTHead>
                <PTR>
                  {newTableHeadings.map((heading) => {
                    const isSorted =
                      currentSortForDynamic &&
                      currentSortForDynamic.key === heading.value

                    return (
                      <PTH
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
                      </PTH>
                    )
                  })}
                </PTR>
              </PTHead>

              <PTBody>
                {this.state.rows.map((row, rowIndex) => {
                  const {
                    currency,
                    symbol,
                    portfolioPerc,
                    price,
                    deltaPrice,
                  } = row

                  const isSelected =
                    (selectedActive && selectedActive.indexOf(rowIndex) >= 0) ||
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
                    `${price} $`,
                    deltaPriceString,
                  ]

                  return (
                    <PTR key={`${currency}${symbol}`} isSelected={isSelected}>
                      {cols.map((col, idx) => {
                        if (col.match(/%/g)) {
                          const color =
                            Number(col.replace(/%/g, '')) >= 0
                              ? '#65c000'
                              : '#ff687a'
                          if (rowIndex !== this.state.activePercentInput) {
                            return (
                              <PTD
                                onClick={() => this.onPercentClick(rowIndex)}
                                key={`${col}${idx}`}
                                style={{ color }}
                              >
                                {col}
                                <EditIcon />
                              </PTD>
                            )
                          } else {
                            return (
                              <PTD key="percentForm">
                                <form onSubmit={this.onPercentSubmit}>
                                  <input
                                    type="number"
                                    value={this.state.activePercentInputValue}
                                    onChange={this.onPercentInputChange}
                                    onBlur={this.onPercentSubmit}
                                    step="0.01"
                                    min="0"
                                    max="100"
                                  />
                                </form>
                              </PTD>
                            )
                          }
                        }
                        if (col.match(/BUY/g)) {
                          const color = '#65c000'

                          return <PTD style={{ color }}>{col}</PTD>
                        }
                        if (col.match(/SELL/g)) {
                          const color = '#ff687a'

                          return <PTD style={{ color }}>{col}</PTD>
                        }

                        return <PTD key={`${col}${idx}`}>{col}</PTD>
                      })}
                      <PTD>
                        <TableButton
                          isDeleteColor={
                            rowIndex === this.state.rows.length - 1
                          }
                          onClick={() => this.onButtonClick(rowIndex)}
                        >
                          {rowIndex === this.state.rows.length - 1 ? (
                            <AddIcon />
                          ) : (
                            <DeleteIcon />
                          )}
                        </TableButton>
                      </PTD>
                    </PTR>
                  )
                })}
              </PTBody>
            </Table>
          </Wrapper>
          </TableAndHeadingWrapper>
        </Container>
        <PieChartsWrapper>
          <PieChartContainer>
            <PieChart
              data={combineToChart(PieChartMockFirst)}
              flexible={true}
            />
          </PieChartContainer>

          <ButtonsWrapper>
            <ActionButtonsContainer>
              <ActionButton onClick={() => this.onSaveClick()}>
                <SaveIcon />
              </ActionButton>
              <ActionButton onClick={() => this.onLoadClick()}>
                <UndoIcon />
              </ActionButton>
            </ActionButtonsContainer>
            <Input
              type="number"
              value={this.state.addMoneyInputValue}
              onChange={this.onAddMoneyInputChange}
            />
            <Button onClick={() => this.onAddMoneyButtonPressed()}>
              Add money
            </Button>
            {this.state.rows[this.state.rows.length - 1].undistributedMoney !==
            0 ? (
              <UndistributedMoneyContainer>
                <UndistributedMoneyText>
                  Undistributed money:{' '}
                  {
                    this.state.rows[this.state.rows.length - 1]
                      .undistributedMoney
                  }
                </UndistributedMoneyText>
                <Button onClick={() => this.onDistribute()}>
                  Distribute to selected
                </Button>
              </UndistributedMoneyContainer>
            ) : null}
          </ButtonsWrapper>

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

const PTWrapper = styled.div`
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 240px);' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 140px);
`

const TableAndHeadingWrapper = styled.div`
   display: flex;
    flex-direction: column;
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
  height: 30vh;
  padding: 0 20px 20px;
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const TableHeading = styled.div`
  text-transform: uppercase;
  font-family: Roboto;
  font-size: 17px;
  color: white;
  font-weight: bold;
  letter-spacing: 1.1px;
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;

  &:nth-child(1) {
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
  & svg {
    width: 15px;
    height: 15px;
  }
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

const PTH = styled.th`
  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: left;
  font-weight: 500;
  position: relative;
  padding: 10px 16px 10px 10px;

  &:nth-child(1) {
    padding: 10px;
    text-align: left;
  }

  &:nth-child(2) {
    text-align: left;
    width: 100px;
  }
  &:nth-child(3) {
    width: 70px;
    text-align: left;
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

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
  &:nth-child(even) {
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
`

const PieChartsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 3% 0;
  width: 100%;
  height: 40vh;

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
  width: 33.3%;
  max-width: 260px;
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

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

const ActionButton = styled.button`
  min-width: 60px;
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
    width: 50px;
    height: 50px;
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

const UndistributedMoneyContainer = styled.div``

const UndistributedMoneyText = styled.p`
  font-family: Roboto;
  color: white;
  font-size: 12px;
  padding: 10px 0 0;
  margin: 0px;
`
