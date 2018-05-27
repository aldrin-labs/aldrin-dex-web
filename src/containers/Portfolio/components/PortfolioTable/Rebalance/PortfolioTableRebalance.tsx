import * as React from 'react'
import styled from 'styled-components'
import { IProps, IState, IRow } from './PortfolioTableRebalance.types'
import {
  tableData,
  combineToChart,
  PieChartMockFirst,
  PieChartMockSecond,
} from './mocks'
import PieChart from '@components/PieChart'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import SaveIcon from 'material-ui-icons/Save'
import UndoIcon from 'material-ui-icons/Undo'
import CompareArrows from 'material-ui-icons/CompareArrows'

// import IconButton from 'material-ui/IconButton'
// import Button from 'material-ui/Button'

const tableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'Current', value: 'price' },
]

const newTableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'Current', value: 'price' },
  { name: 'Trade', value: 'price' },
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
    rows: tableData,
    staticRows: tableData,
    savedRows: tableData,
    addMoneyInputValue: 0,
  }
  componentWillMount() {
    this.calculateAllPercents()
  }
  
  calculateAllPercents = () => {
    this.setState({
      rows: this.calculatePercents(this.state.rows),
      staticRows: this.calculatePercents(this.state.staticRows),
      savedRows: this.calculatePercents(this.state.savedRows),
    })
  }

  calculatePercents = (data: IRow[]) => {
    let total = 0
    data.forEach((row, i, arr) => {
      if (i < data.length - 1) {
        total += data[i].price
      }
    })
    data[data.length - 1].price = total
    data.forEach((row, i, arr) => {
      if (i < data.length - 1) {
        data[i].portfolioPerc =
          Math.ceil(data[i].price * 100 / data[data.length - 1].price * 100) /
          100
      }
    })
    return data
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
    let { selectedActive, areAllActiveChecked } = this.state
    if (rows.length - 1 == idx) {
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
      rows.splice(idx, 1)
      if (selectedActive) {
        let toRemove = -1
        selectedActive.forEach((row, i, arr) => {
          if (selectedActive[i] == idx) {
            //selectedActive.splice(i, 1)
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
      /*
      let money = [rows[idx].portfolioPerc, rows[idx].price]
      let parts = rows.length-2
      let moneyPart = [money[0] / parts, money[1] / parts]
      rows.forEach((row, i, arr) => {
        if(i != rows.length-1){   
          rows[i].portfolioPerc+=moneyPart[0]
          rows[i].portfolioPerc = parseFloat(rows[i].portfolioPerc.toFixed(2))
          rows[i].price+=moneyPart[1]
          rows[i].price = Math.round(rows[i].price)
        }
      })
      */
    }
    rows = this.calculatePercents(rows)
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
    let { selectedActive, rows } = this.state
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
      rows = this.calculatePercents(rows)
      this.setState({ selectedActive, rows })
    }
  }
  onAddMoneyInputChange = (e: any) => {
    this.setState({ addMoneyInputValue: e.target.value })
  }
  onAddMoneyButtonPressed = (e: any) => {
    if (this.state.addMoneyInputValue !== 0) {
      let { rows } = this.state
      rows[rows.length - 1].undistributedMoney += Number(
        this.state.addMoneyInputValue
      )
      this.setState({
        addMoneyInputValue: 0,
        rows,
      })
    }
  }

  render() {
    const { children } = this.props
    const { selectedBalances } = this.state
    const { selectedActive } = this.state

    return (
      <PTWrapper tableData={this.state.rows}>
        {children}
        <Container>
          <TableChartContainer>
            <TableContainer>
            <Table>
              <PTHead>
                <PTR>
                  <PTH /*key="selectAll"*/ style={{ textAlign: 'left' }}>
                    <Checkbox
                      onChange={() => this.onSelectAll()}
                      checked={this.state.areAllChecked}
                      type="checkbox"
                      id="selectAll"
                    />
                    <Label htmlFor="selectAll">
                      <Span />
                    </Label>
                  </PTH>
                  {tableHeadings.map((heading) => (
                    <PTH /*key={heading.name}*/>{heading.name}</PTH>
                  ))}
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
                      /*key={`${currency}${symbol}`}*/
                      isSelected={isSelected}
                      onClick={() => this.onSelectBalance(idx)}
                    >
                      <PTD /*key="smt"*/ isSelected={isSelected}>
                        {idx >= this.state.staticRows.length - 1
                          ? () => {}
                          : this.renderCheckbox(idx)}
                      </PTD>
                      {cols.map((col, index) => {
                        if (col.match(/%/g)) {
                          const color =
                            Number(col.replace(/%/g, '')) >= 0
                              ? '#65c000'
                              : '#ff687a'

                          return (
                            <PTD
                              /*key={`${col}${index}`}*/
                              style={{ color }}
                              isSelected={isSelected}
                            >
                              {col}
                            </PTD>
                          )
                        }

                        return (
                          <PTD
                            /*key={`${col}${index}`}*/ isSelected={isSelected}
                          >
                            {col}
                          </PTD>
                        )
                      })}
                    </PTR>
                  )
                })}
              </PTBody>
            </Table>
          </TableContainer>

            <PieChartContainer>
              <PieChart
                data={combineToChart(PieChartMockFirst)}
                flexible={true}
              />
            </PieChartContainer>
          </TableChartContainer>
          <ActionButton onClick={() => this.onReset()}>
            <CompareArrows />
          </ActionButton>
          <TableChartContainer>
          <TableContainer>
            <Table>
              <PTHead>
                <PTR>
                  <PTH /*key="selectAll"*/ style={{ textAlign: 'left' }}>
                    <Checkbox
                      onChange={() => this.onSelectAllActive()}
                      checked={this.state.areAllActiveChecked}
                      type="checkbox"
                      id="selectAllActive"
                    />
                    <Label htmlFor="selectAllActive">
                      <Span />
                    </Label>
                  </PTH>
                  {newTableHeadings.map((heading) => (
                    <PTH /*key={heading.name}*/>{heading.name}</PTH>
                  ))}
                </PTR>
              </PTHead>

              <PTBody>
                {this.state.rows.map((row, rowIndex) => {
                  const { currency, symbol, portfolioPerc, price } = row

                  const isSelected =
                    (selectedActive && selectedActive.indexOf(rowIndex) >= 0) ||
                    false

                  const cols = [
                    currency,
                    symbol || '',
                    portfolioPerc ? `${portfolioPerc}%` : '',
                    `${price} $`,
                  ]

                  return (
                    <PTR
                      /*key={`${currency}${symbol}`}*/
                      isSelected={isSelected}
                    >
                      <PTD
                        /*key="smt"*/ isSelected={isSelected}
                        onClick={() => this.onSelectActiveBalance(rowIndex)}
                      >
                        {rowIndex >= this.state.rows.length - 1
                          ? () => {}
                          : this.renderActiveCheckbox(rowIndex)}
                      </PTD>
                      {cols.map((col, idx) => {
                        if (col.match(/%/g)) {
                          const color =
                            Number(col.replace(/%/g, '')) >= 0
                              ? '#65c000'
                              : '#ff687a'

                          return (
                            <PTD /*key={`${col}${idx}`}*/ style={{ color }}>
                              {col}
                            </PTD>
                          )
                        }

                        return <PTD /*key={`${col}${idx}`}*/>{col}</PTD>
                      })}
                      <PTD />
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
          </TableContainer>
            <PieChartContainer>
              <PieChart
                data={combineToChart(PieChartMockSecond)}
                flexible={true}
              />
            </PieChartContainer>
          </TableChartContainer>
          <div>
            <ActionButton onClick={() => this.onSaveClick()}>
              <SaveIcon />
            </ActionButton>
            <ActionButton onClick={() => this.onLoadClick()}>
              <UndoIcon />
            </ActionButton>
            <div>
              <input
                type="number"
                value={this.state.addMoneyInputValue}
                onChange={this.onAddMoneyInputChange}
              />
              <button onClick={() => this.onAddMoneyButtonPressed()}>
                Add money
              </button>
            </div>
            {this.state.rows[this.state.rows.length - 1].undistributedMoney !==
            0 ? (
              <div>
                <p>
                  Undistributed money:{' '}
                  {
                    this.state.rows[this.state.rows.length - 1]
                      .undistributedMoney
                  }
                </p>
                <button onClick={() => this.onDistribute()}>
                  Distribute to selected
                </button>
              </div>
            ) : (
              () => {}
            )}
          </div>
        </Container>
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

const Container = styled.div`
  display: flex;
  height: 50%;
  margin-bottom: 20px;
  padding: 20px;
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const PTBody = styled.tbody`
  display: table;
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
  &:nth-child(n + 4) {
    text-align: right;
    min-width: 100px;
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
  &:nth-child(n + 4) {
    width: 100px;
    text-align: right;
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

const TableChartContainer = styled.div`
`

const PieChartHeadingWrapper = styled.div`
  width: 200px;
  text-align: center;
  padding-bottom: 5px;
`

const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3% 0;
  width: 40vw;
  height: 40vh;
  margin: 0 auto;

  @media (max-height: 650px) {
    display: none;
  }
`

const Heading = styled.span`
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #fff;
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

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  & svg {
    color: white;
    width: 30px;
    height: 30px;
  }
`

const TableContainer = styled.div`
    display: flex;
    height: 30vh;    
    overflow-y: scroll;
`
