import * as React from 'react'
import styled from 'styled-components'
import { SingleChart } from '../../components/Chart'
import OnlyCharts from './OnlyCharts'
import { orders } from './mocks'

interface Props {}

interface State {
  view: 'onlyCharts' | 'default'
  orders: number[][]
  currentSort?: {
    arg: 'ASC' | 'DESC'
    index: number
  }
}

const headers = ['Price', 'ETH', 'BTC', 'Sum(BTC)']

export default class Chart extends React.Component<Props, State> {
  state: State = {
    view: 'default',
    orders,
  }

  onToggleView = (view: 'default' | 'onlyCharts') => {
    this.setState({ view })
  }

  sortOrders = (index: number) => {
    const { orders, currentSort } = this.state

    const newOrders = orders.slice().sort((a, b) => {
      if (currentSort && currentSort.index === index) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { index, arg: 'DESC' } })
          return b[index] - a[index]
        } else {
          this.setState({ currentSort: { index, arg: 'ASC' } })
          return a[index] - b[index]
        }
      }
      this.setState({ currentSort: { index, arg: 'ASC' } })
      return a[index] - b[index]
    })

    this.setState({ orders: newOrders })
  }

  renderDefaultView = () => {
    const { orders } = this.state

    return (
      <Container>
        <SingleChart />

        <Tickers />

        <OrderContainer>
          <Orders>
            <thead>
              <TR>
                {headers.map((h, i) => {
                  return <TH onClick={() => this.sortOrders(i)}>{h}</TH>
                })}
              </TR>
            </thead>
            <tbody>
              {orders.map(order => {
                return (
                  <TR>
                    {order.map(o => {
                      return <TD>{o}</TD>
                    })}
                  </TR>
                )
              })}
            </tbody>
          </Orders>
        </OrderContainer>

        <OrderContainer>
          <Orders>
            <thead>
              <TR>
                {headers.map((h, i) => {
                  return <TH onClick={() => this.sortOrders(i)}>{h}</TH>
                })}
              </TR>
            </thead>
            <tbody>
              {orders.map(order => {
                return (
                  <TR>
                    {order.map(o => {
                      return <TD>{o}</TD>
                    })}
                  </TR>
                )
              })}
            </tbody>
          </Orders>
        </OrderContainer>
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

const TR = styled.tr`
  border: 1px solid #fff;
`

const TD = styled.td`
  text-align: right;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  padding: 5px;
  border: 1px solid #fff;
`

const TH = styled.th`
  text-align: left;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 20px;
  font-weight: bold;
  color: #fff;
  border: 1px solid #fff;
  padding: 10px 5px;
  cursor: pointer;
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

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 50px;
`

const Tickers = styled.div`
  display: flex;
  width: 35%;
  height: 500px;
  border: 1px solid lightgrey;
  margin: 1%;
`

const OrderContainer = styled.div`
  width: 45%;
  height: 300px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(255, 255, 255);
  }
`

const Orders = styled.table`
  width: 98%;
  border: 1px solid lightgrey;
  margin: 1%;
  border-collapse: collapse;
`
