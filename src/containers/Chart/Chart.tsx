import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { Paper, Collapse } from '@material-ui/core'
import {
  MdAddCircleOutline,
  MdArrowUpward,
  MdArrowDownward,
} from 'react-icons/lib/md/'
import { FaCircle } from 'react-icons/lib/fa'

import * as actions from './actions'
import { SingleChart } from '../../components/Chart'
import OnlyCharts from './OnlyCharts'
import { orders } from './mocks'
import { orderBook, exchanges } from './fakeData'

interface Props {}

interface IState {
  view: 'onlyCharts' | 'default'
  tableCollapsed: boolean
  exchangeTableCollapsed: boolean
  orders: number[][]
  aggregation: number
  searchSymbol: string
  mCharts: string
  currentSort?: {
    arg: 'ASC' | 'DESC'
    index: number
  }
}

const headers = ['Price', 'ETH', 'BTC', 'Sum(BTC)']

class Chart extends React.Component<Props, IState> {
  state: IState = {
    view: 'default',
    orders,
    searchSymbol: '',
    mCharts: '',
    tableCollapsed: false,
    exchangeTableCollapsed: false,
    aggregation: 0.01,
  }

  roundTill = (n: number, initial: string): number => {
    //  need testing. Not working on all numbers
    // sorry have not much time
    // also working only on aggregation <=10
    // and keeps floor of number instead of round it
    let s = 0

    if (this.state.aggregation <= 5.0) {
      s = -4
    } else {
      s = -5
    }

    let agg = Number(
      initial
        .split('')
        .slice(s)
        .join('')
    )
    /* tslint:disable */
    while (n < agg) {
      agg = agg - n
    }
    /* tslint:enable */

    return +initial - agg
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

  changeExchange = (i: number) => {
    this.props.selectExchange(i)
  }

  setAggregation = () => {
    const { aggregation } = this.state
    switch (aggregation) {
      case 0.01:
        this.setState({ aggregation: 0.05 })
        break
      case 0.05:
        this.setState({ aggregation: 0.1 })
        break
      case 0.1:
        this.setState({ aggregation: 0.5 })
        break
      case 0.5:
        this.setState({ aggregation: 1 })
        break
      case 1:
        this.setState({ aggregation: 2.5 })
        break
      case 2.5:
        this.setState({ aggregation: 5 })
        break
      case 5:
        this.setState({ aggregation: 10 })
        break
      case 10:
        this.setState({ aggregation: 0.01 })
        break
      default:
        this.setState({ aggregation: 0.01 })

        break
    }
  }

  renderDefaultView = () => {
    const { orders, tableCollapsed, aggregation } = this.state
    const { activeExchange } = this.props

    return (
      <Container>
        <SingleChart />

        <TablesContainer>
          <OrderBookTableWrapper>
            <Table>
              <Title>Order Book</Title>
              <Head background={'#292d31'}>
                <Row isHead background={'#292d31'}>
                  <EmptyCell color="#9ca2aa" width={'25%'} />
                  <HeadCell color="#9ca2aa" width={'25%'}>
                    Market Size
                  </HeadCell>
                  <HeadCell color="#9ca2aa" width={'25%'}>
                    Price<br />(USD)
                  </HeadCell>
                  <HeadCell color="#9ca2aa" width={'25%'}>
                    My Size
                  </HeadCell>
                </Row>
              </Head>
              <Body
                notScrollable={this.state.tableCollapsed}
                height={'calc(100vh - 59px - 80px - 39px - 37px - 24px)'}
              >
                {orderBook.slice(0, 30).map((order) => (
                  <Row background={'#292d31'}>
                    <EmptyCell
                      status={'rise'}
                      colored={order.percentageOfChange.toString()}
                      color="#9ca2aa"
                      width={'25%'}
                    />
                    <Cell color="#9ca2aa" width={'25%'}>
                      {Number(order.size).toFixed(8)}
                    </Cell>
                    <Cell color="#34cb86d1" width={'25%'}>
                      {this.roundTill(
                        aggregation,
                        Number(order.price).toFixed(2)
                      ).toFixed(2)}
                    </Cell>
                    <Cell color="#9ca2aa" width={'25%'}>
                      ---
                    </Cell>
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
                    <HeadCell color="#9ca2aa" width={'20%'} />
                    <HeadCell color="#9ca2aa" width={'35%'}>
                      USD spread{' '}
                    </HeadCell>
                    <HeadCell
                      style={{
                        position: 'relative',
                        left: '13%',
                      }}
                      color="#9ca2aa"
                      width={'14%'}
                    >
                      {this.props.usdSpread || 0.01}
                    </HeadCell>
                  </Row>
                </Head>
                <Body height="300px">
                  {orderBook.slice(10, 40).map((order) => (
                    <Row background={'#25282c'}>
                      <EmptyCell
                        status={'fall'}
                        colored={order.percentageOfChange.toString()}
                        color="#9ca2aa"
                        width={'25%'}
                      />
                      <Cell color="#9ca2aa" width={'35%'}>
                        {Number(order.size).toFixed(8)}
                      </Cell>
                      <Cell color="#d77455" width={'30%'}>
                        {this.roundTill(
                          aggregation,
                          Number(order.price).toFixed(2)
                        ).toFixed(2)}
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </CollapseWrapper>
            </CollapsibleTable>
            <Table>
              <Head background={'#292d31'}>
                <Row background={'#292d31'} isHead>
                  <Cell color="#9ca2aa" width={'25%'} />
                  <HeadCell color="#9ca2aa" width={'25%'}>
                    Aggregation
                  </HeadCell>
                  <HeadCell
                    style={{
                      position: 'relative',
                      left: '13%',
                    }}
                    color="#9ca2aa"
                    width={'25%'}
                  >
                    {aggregation.toFixed(2)}
                  </HeadCell>
                  <HeadCell
                    style={{
                      zIndex: 1000,
                    }}
                    color="#9ca2aa"
                    width={'25%'}
                  >
                    <MdAddCircleOutline
                      onClick={this.setAggregation}
                      style={{ fontSize: '1rem', cursor: 'pointer' }}
                    />
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
                  <HeadCell color="#9ca2aa" width={'33%'}>
                    Trade size
                  </HeadCell>
                  <HeadCell color="#9ca2aa" width={'33%'}>
                    Price (USD)
                  </HeadCell>
                  <HeadCell color="#9ca2aa" width={'33%'}>
                    Time
                  </HeadCell>
                </Row>
              </Head>
              <Body
                notScrollable={this.state.exchangeTableCollapsed}
                height="calc(100vh - 59px - 80px - 39px - 37px - 32px )"
              >
                {orderBook.slice(0, 30).map((order) => (
                  <Row background={'#292d31'}>
                    <Cell color="#9ca2aa" width={'33%'}>
                      {order.tradeSize.toFixed(5)}
                    </Cell>
                    <Cell
                      color={order.status === 'fall' ? '#d77455' : '#34cb86d1'}
                      width={'33%'}
                    >
                      {Number(order.size).toFixed(8)}
                      {order.status === 'fall' ? (
                        <MdArrowDownward style={{ verticalAlign: 'top' }} />
                      ) : (
                        <MdArrowUpward style={{ verticalAlign: 'top' }} />
                      )}
                    </Cell>
                    <Cell
                      color={order.status === 'fall' ? '#d77455' : '#34cb86d1'}
                      width={'33%'}
                    >
                      {Number(order.price).toFixed(4)}
                    </Cell>
                  </Row>
                ))}
              </Body>
            </Table>

            <CollapsibleTable style={{ bottom: -1 }}>
              <CollapseWrapper
                in={this.state.exchangeTableCollapsed}
                collapsedHeight="2rem"
              >
                <Title
                  onClick={() => {
                    this.setState((prevState) => ({
                      exchangeTableCollapsed: !prevState.exchangeTableCollapsed,
                    }))
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Exchanges
                </Title>
                <Head style={{ height: '1.625rem' }} background={'#292d31'}>
                  <Row isHead background={'#292d31'}>
                    <HeadCell color="#9ca2aa" width={'20%'}>
                      Name
                    </HeadCell>
                    <HeadCell color="#9ca2aa" width={'20%'}>
                      Cross{' '}
                    </HeadCell>
                    <HeadCell color="#9ca2aa" width={'20%'}>
                      Price
                    </HeadCell>
                    <HeadCell color="#9ca2aa" width={'20%'}>
                      USD
                    </HeadCell>
                    <HeadCell color="#9ca2aa" width={'20%'}>
                      1D Vol(K)
                    </HeadCell>
                  </Row>
                </Head>
                <Body style={{ width: '105%' }} height="100%">
                  {exchanges.map((exchange, ind) => (
                    <Row
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        this.changeExchange(ind)
                      }}
                      background={
                        activeExchange === ind ? '#353c42' : '#16181b'
                      }
                    >
                      {Object.values(exchange).map((prop) => {
                        const keyByValue = Object.keys(exchange).find(
                          (key) => exchange[key] === prop
                        )

                        if (keyByValue === 'status') {
                          return
                        } else if (keyByValue === 'name') {
                          return (
                            <Cell
                              style={{
                                alignItems: 'center',
                                display: 'flex',
                                flexWrap: 'nowrap',
                              }}
                              color="#9ca2aa"
                              width="20%"
                            >
                              <FaCircle
                                style={{
                                  fontSize: '0.5rem',
                                  minWidth: '20%',
                                  flexBasis: '20%',
                                  color: exchange.status,
                                  marginRight: '0.25rem',
                                }}
                              />
                              {prop}
                            </Cell>
                          )
                        } else {
                          return (
                            <Cell color="#9ca2aa" width="20%">
                              {prop}
                            </Cell>
                          )
                        }
                      })}
                    </Row>
                  ))}
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

  onInputChangeMCharts = (event: any) => {
    this.setState({ mCharts: event.target.value })
  }
  onInputChangeSearchSymbol = (event: any) => {
    this.setState({ searchSymbol: event.target.value })
  }

  render() {
    const { view, searchSymbol, mCharts } = this.state
    const toggler = this.renderToggler()

    return (
      <div>
        <TogglerContainer>
          <InputContainer>
            <Input
              onChange={this.onInputChangeSearchSymbol}
              value={searchSymbol}
              placeholder="Search symbol"
            />
            <Input
              onChange={this.onInputChangeMCharts}
              value={mCharts}
              placeholder="Multiple charts"
            />
          </InputContainer>

          {toggler}
        </TogglerContainer>
        {view === 'default' && this.renderDefaultView()}
        {view === 'onlyCharts' && this.renderOnlyCharts()}
      </div>
    )
  }
}

const InputContainer = styled.div`
  padding: 0.5rem;
  margin: auto 2rem auto 0;
  display: flex;
  width: 30%;
  justify-content: center;
`

const Input = styled.input`
  margin: 0 1rem;
  box-sizing: border-box;
  background: transparent;
  border-top: none;
  border-left: none;
  border-bottom: 2px solid rgba(78, 216, 218, 0.3);
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0px;
  color: rgb(255, 255, 255);
  transition: all 0.25s ease-out;

  &:focus {
    border-bottom: 2px solid rgb(78, 216, 218);
  }
`
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

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
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
  color: ${(props: { color: string; width: string }) => props.color};
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

const EmptyCell = Cell.extend`
  position: relative;

  &:before {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: ${(props: { colored?: string }) => Number(props.colored) / 4}%;
    height: 100%;
    content: '';
    background-color: ${(props: { status?: string; colored?: string }) =>
      props.status === 'fall' ? '#d77455' : '#34cb86d1'};
  }
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

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
})

const mapDispatchToProps = (dispatch: any) => ({
  selectExchange: (ex: number) => dispatch(actions.selectExchange(ex)),
})
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(Chart)

export default compose()(storeComponent)
