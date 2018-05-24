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
    let rows = JSON.parse(JSON.stringify(this.state.rows));
    let {selectedActive, areAllActiveChecked} = this.state
    if(rows.length  -  1  ==  idx){
      let newRow = {
        currency: 'Newcoin',
        symbol: 'NEW',
        portfolioPerc: 0.00,
        price: 0,
      }
      rows.splice(rows.length-1, 0, newRow)
      areAllActiveChecked = false
    }else{
      let money = rows[idx].price
      rows[rows.length-1].undistributedMoney+=money
      rows.splice(idx, 1)
      if(selectedActive){
        let toRemove = -1
        selectedActive.forEach((row, i, arr) =>{
          if(selectedActive[i] == idx){
            //selectedActive.splice(i, 1)
            toRemove = i
          }else{
            if(selectedActive[i] > idx){
              selectedActive[i]-=1
            }
          }
        })
        if(toRemove!=-1){
          selectedActive.splice(toRemove, 1)
        }
        if (selectedActive.length >= rows.length-1) {
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
    this.setState({rows, selectedActive, areAllActiveChecked})
  }

  onSelectAll = (e: any) => {
    const selectedBalances =
      (this.state.selectedBalances && this.state.selectedBalances.slice()) || []
    let { areAllChecked } = this.state
    if (selectedBalances.length >= this.state.staticRows.length-1) {
      selectedBalances.splice(0, selectedBalances.length)
      areAllChecked = false
    } else {
      selectedBalances.splice(0, selectedBalances.length)
      this.state.staticRows.map((a, i) => {
        if(i<this.state.staticRows.length-1){
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
    if (selectedActive.length >= this.state.rows.length-1) {
      selectedActive.splice(0, selectedActive.length)
      areAllActiveChecked = false
    } else {
      selectedActive.splice(0, selectedActive.length)
      this.state.rows.map((a, i) => {
        if(i<this.state.rows.length-1){
          selectedActive.push(i)
        }
      })
      areAllActiveChecked = true
    }
    this.setState({ selectedActive, areAllActiveChecked })
  }

  onSelectBalance = (idx: number) => {
    if(idx<this.state.staticRows.length-1){
      const selectedBalances =
        (this.state.selectedBalances && this.state.selectedBalances.slice()) || []
      let { areAllChecked } = this.state
      const hasIndex = selectedBalances.indexOf(idx)
      if (hasIndex >= 0) {
        selectedBalances.splice(hasIndex, 1)
      } else {
        selectedBalances.push(idx)
      }
      if (selectedBalances.length >= this.state.staticRows.length-1) {
        areAllChecked = true
      } else {
        areAllChecked = false
      }
      this.setState({ selectedBalances, areAllChecked })
    }
  }
  onSelectActiveBalance = (idx: number) => {
    if(idx<this.state.rows.length-1){
      const selectedActive =
        (this.state.selectedActive && this.state.selectedActive.slice()) || []
      let { areAllActiveChecked } = this.state
      const hasIndex = selectedActive.indexOf(idx)
      if (hasIndex >= 0) {
        selectedActive.splice(hasIndex, 1)
      } else {
        selectedActive.push(idx)
      }
      if (selectedActive.length >= this.state.rows.length-1) {
        areAllActiveChecked = true
      } else {
        areAllActiveChecked = false
      }
      this.setState({ selectedActive, areAllActiveChecked })
    }
  }
  onSaveClick = (e: any) => {
    this.setState({savedRows:this.state.rows})
  }
  onLoadClick = (e: any) => {
    this.setState({rows:this.state.savedRows})
  }

  onDistribute = (e:any) => {
    let {selectedActive, rows} = this.state
    if(selectedActive&&selectedActive.length>0){
      if(selectedActive.length>1){      
      let money = rows[rows.length-1].undistributedMoney
      let moneyPart = Math.floor(money/selectedActive.length)
      selectedActive.forEach((row, i, arr) => {
        rows[selectedActive[i]].price+=moneyPart
        money-=moneyPart        
      })
      rows[rows.length-1].undistributedMoney = money
      }else{
        rows[selectedActive[0]].price += rows[rows.length-1].undistributedMoney
        rows[rows.length-1].undistributedMoney = 0        
      }
      this.setState({selectedActive, rows})
    }
  }
  onAddMoneyInputChange = (e: any) => {
    this.setState({addMoneyInputValue: e.target.value})
  }
  onAddMoneyButtonPressed = (e: any) => {
    if(this.state.addMoneyInputValue!=0){
      let {rows} = this.state
      rows[rows.length-1].undistributedMoney += Number(this.state.addMoneyInputValue)
      this.setState({addMoneyInputValue: 0,
                    rows})
    }
  }
  


  render() {
    const { children } = this.props
    const { selectedBalances } = this.state
    const {selectedActive} = this.state

    return (
      <PTWrapper tableData={this.state.rows}>
        {children}
        <Container>
          <TableChartContainer>
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
                        {idx>=this.state.staticRows.length-1?()=>{}:this.renderCheckbox(idx)}
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
                          <PTD /*key={`${col}${index}`}*/ isSelected={isSelected}>
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
                    <PTD /*key="smt"*/ isSelected={isSelected}
                    onClick={() => this.onSelectActiveBalance(rowIndex)}>
                        {rowIndex>=this.state.rows.length-1?()=>{}:this.renderActiveCheckbox(rowIndex)}
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
                      <PTD></PTD>
                      <PTD><button onClick={() => this.onButtonClick(rowIndex)}>{rowIndex == this.state.rows.length-1 
                                    ? 'add'
                                    : 'delete' }</button></PTD>
                    </PTR>                    
                  )
                })}
              </PTBody>
            </Table>
            <button onClick={() => this.onSaveClick()}>save</button>
            <button onClick={() => this.onLoadClick()}>load</button>
            <div>
            <input type="number" value={this.state.addMoneyInputValue} onChange={this.onAddMoneyInputChange} />
            <button onClick={() => this.onAddMoneyButtonPressed()}>Add money</button>
            </div>
            {this.state.rows[this.state.rows.length-1].undistributedMoney!=0?
              <div>
                <p>Undistributed money: {this.state.rows[this.state.rows.length-1].undistributedMoney}</p>
                <button onClick={() => this.onDistribute()}>Distribute to selected</button>
              </div>
              :()=>{}}
            
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
