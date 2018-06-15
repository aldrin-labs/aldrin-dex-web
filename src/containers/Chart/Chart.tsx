import * as React from 'react'
import styled from 'styled-components'
import { Paper, Collapse } from '@material-ui/core'
import AddIcon from 'react-icons/lib/md/add-circle-outline'

import { SingleChart } from '../../components/Chart'
import OnlyCharts from './OnlyCharts'
import { orders } from './mocks'
import { orderBook } from './fakeData'

interface Props {}

interface State {
  view: 'onlyCharts' | 'default'
  tableCollapsed: boolean
  exchangeTableCollapsed: boolean
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
    tableCollapsed: false,
    exchangeTableCollapsed: false,
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
    const { orders, tableCollapsed } = this.state

    return (
      <Container>
        <SingleChart />

        <TablesContainer>
          <OrderBookTableWrapper>
            <Table>
              <Title>Order Book</Title>
              <Head background={'#292d31'}>
                <Row isHead background={'#292d31'}>
                  <HeadCell width={'25%'} />
                  <HeadCell width={'25%'}>Market Size</HeadCell>
                  <HeadCell width={'25%'}>
                    Price<br />(USD)
                  </HeadCell>
                  <HeadCell width={'25%'}>My Size</HeadCell>
                </Row>
              </Head>
              <Body
                notScrollable={this.state.tableCollapsed}
                height={'calc(100vh - 59px - 80px - 39px - 37px - 24px)'}
              >
                {orderBook.map((order) => (
                  <Row background={'#292d31'}>
                    <Cell width={'25%'} />
                    <Cell width={'25%'}>{Number(order.size).toFixed(8)}</Cell>
                    <Cell width={'25%'}>{Number(order.price).toFixed(4)}</Cell>
                    <Cell width={'25%'}>---</Cell>
                  </Row>
                ))}
              </Body>
            </Table>

            <CollapsibleTable
              onClick={() => {
                this.setState((prevState) => ({
                  tableCollapsed: !prevState.tableCollapsed,
                }))
              }}
            >
              <CollapseWrapper in={tableCollapsed} collapsedHeight="1.5rem">
                <Head
                  background={'#292d31'}
                  style={{ cursor: 'pointer', height: '1.625rem' }}
                >
                  <Row isHead background={'#292d31'}>
                    <HeadCell width={'20%'} />
                    <HeadCell width={'35%'}>USD spread </HeadCell>
                    <HeadCell width={'14%'}>0.01</HeadCell>
                  </Row>
                </Head>
                <Body height="500px">
                  {orderBook.map((order) => (
                    <Row background={'#25282c'}>
                      <Cell width={'20%'} />
                      <Cell width={'35%'}>{Number(order.size).toFixed(8)}</Cell>
                      <Cell width={'30%'}>
                        {Number(order.price).toFixed(4)}
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </CollapseWrapper>
            </CollapsibleTable>
            <Table>
              <Head background={'#292d31'}>
                <Row background={'#292d31'} isHead>
                  <Cell width={'25%'} />
                  <HeadCell width={'25%'}>Aggregation</HeadCell>
                  <HeadCell width={'25%'}>0.01</HeadCell>
                  <HeadCell width={'25%'}>
                    <AddIcon />
                  </HeadCell>
                </Row>
              </Head>
            </Table>
          </OrderBookTableWrapper>
          <OrderBookTableWrapper>
            <Table>
              <Title>Trade history</Title>
              <Head background={'#292d31'}>
                <Row background={'#292d31'} isHead>
                  <HeadCell width={'33%'}>Trade size</HeadCell>
                  <HeadCell width={'33%'}>Price (USD)</HeadCell>
                  <HeadCell width={'33%'}>Time</HeadCell>
                </Row>
              </Head>
              <Body
                notScrollable={this.state.exchangeTableCollapsed}
                height="calc(100vh - 59px - 80px - 39px - 37px - 32px )"
              >
                {orderBook.map((order) => (
                  <Row background={'#292d31'}>
                    <Cell width={'33%'} />
                    <Cell width={'33%'}>{Number(order.size).toFixed(8)}</Cell>
                    <Cell width={'33%'}>{Number(order.price).toFixed(4)}</Cell>
                  </Row>
                ))}
              </Body>
            </Table>
            <CollapsibleTable
              style={{ bottom: -1 }}
              onClick={() => {
                this.setState((prevState) => ({
                  exchangeTableCollapsed: !prevState.exchangeTableCollapsed,
                }))
              }}
            >
              <CollapseWrapper
                in={this.state.exchangeTableCollapsed}
                collapsedHeight="2rem"
              >
                <Title style={{ cursor: 'pointer' }}>Exchanges</Title>
                <Body height="100%">
                  <Row background={'#25282c'}>
                    <Cell width={'33%'} />
                    <Cell width={'33%'}>IN WORK</Cell>
                  </Row>
                </Body>
              </CollapseWrapper>
            </CollapsibleTable>
          </OrderBookTableWrapper>
        </TablesContainer>
      </Container>
    )
  }

  renderOnlyCharts = () => <OnlyCharts />

  renderToggler = () => {
    const { view } = this.state

    if (view === 'default') {
      return (
        <Toggler onClick={() => this.onToggleView('onlyCharts')}>
          &#9680;
        </Toggler>
      )
    }
    if (view === 'onlyCharts') {
      return (
        <Toggler onClick={() => this.onToggleView('default')}>&#9681;</Toggler>
      )
    }

    return null
  }

  renderOrderBookTable = () => {
    return
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

//  FlexTable

const Title = styled.div`
  width: 100%;
  text-transform: uppercase;
  color: white;
  font-size: 14px;
  font-weight: 700;
  padding: 10px;
  background: #353d46;
  text-align: center;
  vertical-align: middle;
`

const OrderBookTableWrapper = styled(Paper)`
  min-width: 300px;
  width: 50%;
  position: relative;
  border-right: 1px solid #30353a;

  && {
    overflow: hidden;
    background-color: #292d31;
    box-shadow: none !important;
  }
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const TablesContainer = styled.div`
  position: relative;
  display: flex;
  width: 50%;
  height: calc(100vh - 59px - 80px);
  overflow: hidden;
`
const Table = styled.div`
  font-family: Roboto, sans-serif;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  max-height: calc(100vh - 59px - 80px);
  overflow-y: hidden;
`

const Body = styled.div`
  width: 100%;
  height: ${(props: { height: string }) => props.height};
  overflow-y: ${(props: { notScrollable?: boolean; height: string }) =>
    props.notScrollable ? 'hidden' : 'scroll'};

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

const CollapsibleTable = Table.extend`
  max-height: 28rem;
  position: absolute;
  bottom: 23px;
  left: 0;
  z-index: 999;
  width: 100%;
`

const Row = styled.div`
  width: 100%;
  display: flex;
  border-top: ${(props: { isHead?: boolean }) =>
    props.isHead ? '1px solid #818d9ae6' : 'none'};
  border-bottom: 1px solid #2d3136;
  transition: background 0.25s ease;
  background-color: ${(props: { isHead?: boolean; background: string }) =>
    props.background};

  &:hover {
    background: ${(props: { isHead?: boolean }) =>
      props.isHead ? '#292d31' : '#454f59'};
  }
`

const Cell = styled.div`
  overflow: hidden;
  list-style: none;
  padding: 0.25rem 0.4rem;
  font-weight: 600;
  font-size: 0.75rem;
  flex-basis: ${(props: { width: string }) => props.width};
  color: #9ca2aa;
  text-align: center;
  vertical-align: middle;
`
const HeadCell = Cell.extend`
  font-weight: 400;
  font-size: 0.75rem;
  white-space: nowrap;
  width: 7%;
  color: white;
`

const Head = styled.div`
  height: 40px;
  width: 100%;
  color: white;
  background-color: ${(props: { background: string }) => props.background};
  border-bottom: 1px solid #818d9ae6;
  position: sticky;
  top: 0;

  font-family: Roboto, sans-serif;
`

// end of FlexTable

const TR = styled.tr`
  border: 1px solid #fff;
`

const TD = styled.td`
  text-align: right;
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  padding: 5px;
  border: 1px solid #fff;
`

const TH = styled.th`
  text-align: left;
  font-family: Roboto;
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
