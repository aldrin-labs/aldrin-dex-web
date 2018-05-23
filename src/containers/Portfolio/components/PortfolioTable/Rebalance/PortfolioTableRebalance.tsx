import * as React from 'react'
import styled from 'styled-components'
import { IProps, IState } from './PortfolioTableRebalance.types'
import {
  tableData,
  combineToChart,
  PieChartMockFirst,
  PieChartMockSecond,
} from './mocks'
import PieChart from '@components/PieChart'

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
  { name: 'Add money', value: 'price' },
  { name: 'Trade', value: 'price' },
]

export default class PortfolioTableRebalance extends React.Component<
  IProps,
  IState
> {
  state: IState = {
    selectedBalances: null,
    areAllChecked: false,
    rows: tableData
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

  onButtonClick = (idx: number) => {
    //console.log(idx)
    let {rows} = this.state
    if(rows.length  -  1  ==  idx){
      rows.splice(rows.length-2, 0, rows[0])
    }else{
      //console.log(rows[idx])
      let money = [rows[idx].portfolioPerc, rows[idx].price]
      //console.log(money)
      let parts = rows.length-2
      //console.log(parts)
      let moneyPart = [money[0] / parts, money[1] / parts]
      //console.log(moneyPart)
      rows.splice(idx, 1)
      rows.forEach((row, i, arr) => {
        if(i != rows.length-1){        
          console.log(i)
          rows[i].portfolioPerc+=moneyPart[0]
          rows[i].portfolioPerc = parseFloat(rows[i].portfolioPerc.toFixed(2))
          rows[i].price+=moneyPart[1]
          rows[i].price = Math.round(rows[i].price)
        }
      })
    }    
    this.setState({rows})
  }

  onSelectAll = (e: any) => {
    console.log('select all')
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []
    let { areAllChecked } = this.state
    console.log(selectedBalances.length)
    console.log(this.state.rows.length)
    if (selectedBalances.length >= this.state.rows.length) {
      selectedBalances.splice(0, selectedBalances.length)
      areAllChecked = false
    } else {
      selectedBalances.splice(0, selectedBalances.length)
      this.state.rows.map((a, i) => {
        selectedBalances.push(i)
      })
      areAllChecked = true
    }
    this.setState({ selectedBalances, areAllChecked })
  }

  onSelectBalance = (idx: number) => {
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []
    let { areAllChecked } = this.state
    const hasIndex = selectedBalances.indexOf(idx)
    if (hasIndex >= 0) {
      selectedBalances.splice(hasIndex, 1)
    } else {
      selectedBalances.push(idx)
    }
    if (selectedBalances.length >= this.state.rows.length) {
      areAllChecked = true
    } else {
      areAllChecked = false
    }
    this.setState({ selectedBalances, areAllChecked })
  }

  render() {
    const { children } = this.props
    const { selectedBalances } = this.state

    return (
      <PTWrapper tableData={this.state.rows}>
        {children}
        <Container>
          <TableChartContainer>
            <Table>
              <PTHead>
                <PTR>
                  <PTH key="selectAll" style={{ textAlign: 'left' }}>
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
                    <PTH key={heading.name}>{heading.name}</PTH>
                  ))}
                </PTR>
              </PTHead>

              <PTBody>
                {this.state.rows.map((row, idx) => {
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
                      key={`${currency}${symbol}`}
                      isSelected={isSelected}
                      onClick={() => this.onSelectBalance(idx)}
                    >
                      <PTD key="smt" isSelected={isSelected}>
                        {this.renderCheckbox(idx)}
                      </PTD>
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
            </Table>

            <PieChartContainer>
              <PieChart
                data={combineToChart(PieChartMockFirst)}
                flexible={true}
              />
            </PieChartContainer>
          </TableChartContainer>
          <TableChartContainer>
            <Table>
              <PTHead>
                <PTR>
                  {newTableHeadings.map((heading) => (
                    <PTH key={heading.name}>{heading.name}</PTH>
                  ))}
                </PTR>
              </PTHead>

              <PTBody>
                {this.state.rows.map((row, rowIndex) => {
                  const { currency, symbol, portfolioPerc, price } = row

                  const cols = [
                    currency,
                    symbol || '',
                    portfolioPerc ? `${portfolioPerc}%` : '',
                    `${price} $`,
                  ]

                  return (
                    <PTR key={`${currency}${symbol}`}>
                      {cols.map((col, idx) => {
                        if (col.match(/%/g)) {
                          const color =
                            Number(col.replace(/%/g, '')) >= 0
                              ? '#65c000'
                              : '#ff687a'

                          return (
                            <PTD key={`${col}${idx}`} style={{ color }}>
                              {col}                              
                            </PTD>
                          )
                        }

                        return <PTD key={`${col}${idx}`}>{col}</PTD>
                      })}
                      <PTD></PTD>
                      <PTD></PTD>
                      <PTD><button onClick={() => this.onButtonClick(rowIndex)}>{rowIndex == this.state.rows.length-1 
                                    ? 'add'
                                    : 'delete' }</button></PTD>
                    </PTR>                    
                  )
                })}
              </PTBody>
            </Table>

            <PieChartContainer>
              <PieChart
                data={combineToChart(PieChartMockSecond)}
                flexible={true}
              />
            </PieChartContainer>
          </TableChartContainer>
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
  border-collapse: collapse;
`

const PTBody = styled.tbody`
  border-top: 1px solid #fff;
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
  text-align: right;

  &:first-child {
    text-align: left;
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
  padding: 10px 10px;
  text-align: left;
  font-weight: 500;
  position: relative;
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

const PTHead = styled.thead``

const TableChartContainer = styled.div``

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
  width: 35vw;
  height: 35vh;
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
