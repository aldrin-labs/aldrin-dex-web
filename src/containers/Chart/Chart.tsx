import * as React from 'react'
import styled from 'styled-components'
import { SingleChart } from '../../components/Chart'
import OnlyCharts from './OnlyCharts'
import { orders } from './mocks'
import { tickers } from './mocks'

interface Props {}

interface State {
  view: 'onlyCharts' | 'default'
  orders: number[][]
  tickers: any[][]
  currentOrdersSort?: {
    arg: 'ASC' | 'DESC'
    index: number
  }
  currentTickersSort?: {
    arg: 'ASC' | 'DESC'
    index: number
  }
}

const ordersHeaders = ['Price', 'ETH', 'BTC', 'Sum(BTC)']
const tickersHeaders = ['Coin', 'Price', 'Volume', 'Change', 'Name']

export default class Chart extends React.Component<Props, State> {
  state: State = {
    view: 'default',
    orders,
    tickers,
  }

  onToggleView = (view: 'default' | 'onlyCharts') => {
    this.setState({ view })
  }

  sortOrders = (index: number) => {
    const { orders, currentOrdersSort } = this.state

    const newOrders = orders.slice().sort((a, b) => {
      if (currentOrdersSort && currentOrdersSort.index === index) {
        if (currentOrdersSort.arg === 'ASC') {
          this.setState({ currentOrdersSort: { index, arg: 'DESC' } })
          return b[index] - a[index]
        } else {
          this.setState({ currentOrdersSort: { index, arg: 'ASC' } })
          return a[index] - b[index]
        }
      }
      this.setState({ currentOrdersSort: { index, arg: 'ASC' } })
      return a[index] - b[index]
    })

    this.setState({ orders: newOrders })
  }

  sortTickers = (index: number) => {
    const { tickers, currentTickersSort } = this.state

    const newTickers = tickers.slice().sort((a, b) => {
      if (currentTickersSort && currentTickersSort.index === index) {
        if (currentTickersSort.arg === 'ASC') {
          this.setState({ currentTickersSort: { index, arg: 'DESC' } })
          if(a[index] < b[index]) return -1;
          if(a[index] > b[index]) return 1;
        } else {
          this.setState({ currentTickersSort: { index, arg: 'ASC' } })
          if(a[index] > b[index]) return -1;
          if(a[index] < b[index]) return 1;
        }
      }
      this.setState({ currentTickersSort: { index, arg: 'ASC' } })
      return a[index] - b[index]
    })

    this.setState({ tickers: newTickers })
  }

  renderDefaultView = () => {
    const { tickers } = this.state

    return (
      <Container>
        <RowContainer>
          <SingleChart />

          <TickersContainer>
            <Tickers>
              <thead>
                <TR>
                  {tickersHeaders.map((h, i) => {
                    return <TH onClick={() => this.sortTickers(i)}>{h}</TH>
                  })}
                </TR>
              </thead>
              <Tbody ticker>
                {tickers.map(ticker => {
                  return (
                    <TR>
                      {ticker.map(o => {
                        return <TD>{o}</TD>
                      })}
                    </TR>
                  )
                })}
              </Tbody>
            </Tickers>
          </TickersContainer>
        </RowContainer>
        
        <RowContainer>
          <OrderContainer buy>
            <Orders>
              <thead>
                <TR>
                  {ordersHeaders.map((h, i) => {
                    return <TH onClick={() => this.sortOrders(i)}>{h}</TH>
                  })}
                </TR>
              </thead>
              <Tbody>
                {orders.map(order => {
                  return (
                    <TR>
                      {order.map(o => {
                        return <TD>{o}</TD>
                      })}
                    </TR>
                  )
                })}
              </Tbody>
            </Orders>
          </OrderContainer>

          <OrderContainer sell>
            <Orders>
              <thead>
                <TR>
                  {ordersHeaders.map((h, i) => {
                    return <TH onClick={() => this.sortOrders(i)}>{h}</TH>
                  })}
                </TR>
              </thead>
              <Tbody>
                {orders.map(order => {
                  return (
                    <TR>
                      {order.map(o => {
                        return <TD>{o}</TD>
                      })}
                    </TR>
                  )
                })}
              </Tbody>
            </Orders>
          </OrderContainer>
        </RowContainer>
        <RowContainer>
          <HistoryContainer>
            <History>
                <thead>
                  <TR>
                    {ordersHeaders.map((h, i) => {
                      return <TH onClick={() => this.sortOrders(i)}>{h}</TH>
                    })}
                  </TR>
                </thead>
                <Tbody>
                  {orders.map(order => {
                    return (
                      <TR>
                        {order.map(o => {
                          return <TD>{o}</TD>
                        })}
                      </TR>
                    )
                  })}
                </Tbody>
            </History>
          </HistoryContainer>
        </RowContainer>
      </Container>
    )
  }

  renderOnlyCharts = () => {
    return <OnlyCharts />
  }

  renderToggler = () => {
    const { view } = this.state

    if (view === 'default')
      return (
        <Toggler onClick={() => this.onToggleView('onlyCharts')}>
          &#9680;
        </Toggler>
      )
    if (view === 'onlyCharts')
      return (
        <Toggler onClick={() => this.onToggleView('default')}>&#9681;</Toggler>
      )

    return null
  }

  render() {
    const { view } = this.state

    const toggler = this.renderToggler()

    return (
      <div>
        <TogglerContainer>{toggler}</TogglerContainer>
        {view === 'default' && this.renderDefaultView()}
        {view === 'onlyCharts' && this.renderOnlyCharts()}
      </div>
    )
  }
}

const Tbody = styled.tbody`
  display: block;
  height: ${props => props.ticker ? '468px' : '300px'};
  overflow: auto;
  width: 100%;
  &::-webkit-scrollbar {
    width: 0px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(255, 255, 255);
  }
`

const TR = styled.tr`
  display: table;
  width:100%;
  table-layout:fixed;  
`

const TD = styled.td`  
  text-align: right;
  font-family: Roboto;
  padding: 5px;
  box-shadow: 0px 1px 0px 0px #4ed8da, 1px 0px 0px 0px #4ed8da;
`

const TH = styled.th`
  text-align: left;
  font-family: Roboto;
  font-weight: bold;
  padding: 10px 5px;
  cursor: pointer;
  box-shadow: 0px 1px 0px 0px #4ed8da, 1px 0px 0px 0px #4ed8da;
  &:last-child{
    box-shadow:0px 1px 0px 0px #4ed8da;
  }
`

const TogglerContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`

const Toggler = styled.button`
  font-size: 30px;
  border: none;
  background: transparent;
  color: #fff;
  outline: none;
  margin: 0.5% 2%;
  padding: 5px;
  cursor: pointer;
`

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Container = styled.div`  
  width: 100%;
  padding: 0 32px 0 32px;
`

const TickersContainer = styled.div`
  display: flex;
  width: 35%;
  height: 500px;
  border: 1px solid #4ed8da;
  background-color: #292d31;
  border-radius: 3px;
  margin: 0 0 16px 0;
  `

const Tickers = styled.table`
  width: 100%;
  border-collapse: collapse;  
  color: #fff;
  font-size: 12px;
  line-height: 10px;  
  color: #fff;
  word-wrap: normal;
`

const OrderContainer = styled.div`

  width: 50%;
  margin-right: ${props => props.buy ? '16px' : '0'};
  background-color: #292d31;
  border: 1px solid #4ed8da;
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);   
`

const Orders = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  line-height: 20px;  
  color: #fff;
`

const HistoryContainer = styled.div`
  width: 100%;
  margin-top: 16px;
  background-color: #292d31;
  border: 1px solid #4ed8da;
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);   
`

const History = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  line-height: 20px;  
  color: #fff;
`
