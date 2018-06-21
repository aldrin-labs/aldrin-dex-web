import React from 'react'
import styled, { keyframes } from 'styled-components'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { Paper, Collapse, Button } from '@material-ui/core'
import {
  MdAddCircleOutline,
  MdArrowUpward,
  MdArrowDownward,
  MdArrowDropUp,
} from 'react-icons/lib/md/'
import { FaCircle } from 'react-icons/lib/fa'

import OrderBookTable from './Tables/OrderBookTable/OrderBookTable'
import UsdSpreadTable from './Tables/UsdSpreadTable/UsdSpreadTable'
import * as actions from './actions'
import { SingleChart } from '../../components/Chart'
import OnlyCharts from './OnlyCharts'
import {
  orderBook,
  exchanges,
  orders,
  usdSpread,
  getFakeDepthChartData,
} from './mocks'
import Switch from '@components/Switch/Switch'
import DepthChart from './DepthChart/DepthChart'
import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell as RowCell,
  HeadCell,
} from '@components/Table/Table'
import Input from '@components/Input/Input'
interface Props {}

interface IState {
  view: 'onlyCharts' | 'default'
  exchangeTableCollapsed: boolean
  orders: number[][]
  aggregation: number
  data: any
  searchSymbol: string
  showTableOnMobile: string
  mCharts: string
  activeChart: string
  currentSort?: {
    arg: 'ASC' | 'DESC'
    index: number
  }
}

class Chart extends React.Component<Props, IState> {
  state: IState = {
    view: 'default',
    orders,
    searchSymbol: '',
    mCharts: '',
    exchangeTableCollapsed: true,
    aggregation: 0.01,
    showTableOnMobile: 'ORDER',
    activeChart: 'depth',
    orderBook: [],
    exchanges: [],
    usdSpread: [],
    usdSpreads: null,
  }

  componentDidMount() {
    const { isShownMocks } = this.props

    if (isShownMocks) {
      this.setState({ orderBook, exchanges, usdSpread })
    } else {
      // fetchData
    }
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

  changeTable = () => {
    this.setState((prevState) => ({
      showTableOnMobile:
        prevState.showTableOnMobile === 'ORDER' ? 'TRADE' : 'ORDER',
    }))
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
  // bullshit code be carefuly
  demoAnime = (sizeInd: number) => {
    const setFalseForSecond = (ind: number) => {
      setTimeout(() => {
        this.setState({
          orderBook: this.state.orderBook.map(
            (el, i) =>
              i === ind
                ? Object.assign({}, el, {
                    updated: true,
                  })
                : el
          ),
        })
      }, 10)

      return false
    }

    this.setState({
      orderBook: this.state.orderBook.map(
        (el, i) =>
          el.size === sizeInd
            ? Object.assign({}, el, {
                updated: el.updated === true ? setFalseForSecond(i) : true,
                percentageOfChange:
                  Math.floor(Math.random() * (100 - 0 + 1)) + 0,
              })
            : el
      ),
    })
  }
  demoAnimed = (sizeInd: number) => {
    const setFalseForSecond = (ind: number) => {
      setTimeout(() => {
        this.setState({
          usdSpread: this.state.usdSpread.map(
            (el, i) =>
              i === ind
                ? Object.assign({}, el, {
                    updated: true,
                  })
                : el
          ),
        })
      }, 10)

      return false
    }

    this.setState({
      usdSpread: this.state.usdSpread.map(
        (el, i) =>
          el.size === sizeInd
            ? Object.assign({}, el, {
                updated: el.updated === true ? setFalseForSecond(i) : true,
                percentageOfChange:
                  Math.floor(Math.random() * (100 - 0 + 1)) + 0,
              })
            : el
      ),
    })
  }

  renderTables: any = () => {
    const {
      aggregation,
      showTableOnMobile,
      exchangeTableCollapsed,
    } = this.state
    const { activeExchange } = this.props

    return (
      <TablesContainer>
        <TablesBlockWrapper show={showTableOnMobile === 'ORDER'}>
          <OrderBookTable
            {...{
              onButtonClick: this.changeTable,
              data: orderBook,
              demoAnime: this.demoAnime,
              roundTill: this.roundTill,
              aggregation,
            }}
          />

          <UsdSpreadTable
            {...{
              roundTill: this.roundTill,
              data: usdSpread,
              aggregation,
            }}
          />

          <AggregationTable>
            <Head background={'#292d31'}>
              <Row background={'#292d31'} isHead>
                <Cell color="#9ca2aa" width={'25%'} />
                <HeadCell
                  style={{
                    position: 'relative',
                    left: '5%',
                  }}
                  color="#9ca2aa"
                  width={'25%'}
                >
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
          </AggregationTable>
        </TablesBlockWrapper>

        <TablesBlockWrapper show={showTableOnMobile === 'TRADE'}>
          <Table>
            <Title>
              Trade history
              <SwitchTablesButton
                onClick={this.changeTable}
                variant="outlined"
                color="primary"
              >
                ORDER
              </SwitchTablesButton>
            </Title>
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
            <Body height="calc(100vh - 59px - 80px - 39px - 37px - 32px )">
              {this.state.orderBook.slice(0, 30).map((order, i) => (
                <Row
                  onClick={() => {
                    this.demoAnime(order.size)
                  }}
                  key={i}
                  background={'#292d31'}
                >
                  <Cell
                    animated={(() => {
                      if (order.status === 'fall' && order.updated) {
                        return 'red'
                      }

                      if (order.status === 'grow' && order.updated) {
                        return 'green'
                      }

                      return 'none'
                    })()}
                    color="#9ca2aa"
                    width={'33%'}
                  >
                    {order.tradeSize.toFixed(5)}
                  </Cell>
                  <Cell
                    animated={(() => {
                      if (order.status === 'fall' && order.updated) {
                        return 'red'
                      }

                      if (order.status === 'grow' && order.updated) {
                        return 'green'
                      }

                      return 'none'
                    })()}
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
                    animated={(() => {
                      if (order.status === 'fall' && order.updated) {
                        return 'red'
                      }

                      if (order.status === 'grow' && order.updated) {
                        return 'green'
                      }

                      return 'none'
                    })()}
                    color="#9ca2aa"
                    width={'33%'}
                  >
                    {order.time}
                  </Cell>
                </Row>
              ))}
            </Body>
          </Table>

          <ExchangesTable>
            <CollapseWrapper
              in={this.state.exchangeTableCollapsed}
              collapsedHeight="2rem"
            >
              <TriggerTitle
                onClick={() => {
                  this.setState((prevState) => ({
                    exchangeTableCollapsed: !prevState.exchangeTableCollapsed,
                  }))
                }}
              >
                <StyledArrowSign
                  style={{ marginRight: '0.5rem' }}
                  tableCollapsed={!exchangeTableCollapsed}
                  up={!exchangeTableCollapsed}
                />
                Exchanges
              </TriggerTitle>
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
                {this.state.exchanges.map((exchange, ind) => (
                  <Row
                    key={ind}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      this.changeExchange(ind)
                    }}
                    background={activeExchange === ind ? '#353c42' : '#16181b'}
                  >
                    {Object.values(exchange).map((prop, propinx) => {
                      const keyByValue = Object.keys(exchange).find(
                        (key) => exchange[key] === prop
                      )

                      if (keyByValue === 'status') {
                        return
                      } else if (keyByValue === 'name') {
                        return (
                          <Cell
                            key={propinx}
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
                          <Cell key={propinx} color="#9ca2aa" width="20%">
                            {prop}
                          </Cell>
                        )
                      }
                    })}
                  </Row>
                ))}
              </Body>
            </CollapseWrapper>
          </ExchangesTable>
        </TablesBlockWrapper>
      </TablesContainer>
    )
  }

  renderDefaultView = () => {
    const { usdSpreadFakeData, orderBookFakeData } = getFakeDepthChartData()

    return (
      <Container>
        <ChartsContainer>
          <ChartsSwitcher>
            <Switch
              onClick={() => {
                this.setState((prevState) => ({
                  activeChart:
                    prevState.activeChart === 'candle' ? 'depth' : 'candle',
                }))
              }}
              values={['Depth', 'Chart']}
            />
          </ChartsSwitcher>
          {this.state.activeChart === 'candle' ? (
            <SingleChart />
          ) : (
            <DepthChartContainer>
              <DepthChart
                {...{
                  orderData: orderBookFakeData,
                  spreadData: usdSpreadFakeData,
                }}
              />
            </DepthChartContainer>
          )}
        </ChartsContainer>

        {this.renderTables()}
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
      <MainContainer>
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
      </MainContainer>
    )
  }
}

const MainContainer = styled.div`
  font-family: Roboto, sans-serif;
`
const DepthChartContainer = styled.div`
  height: calc(100vh - 59px - 80px - 38px);
  width: 100%;
`

const InputContainer = styled.div`
  padding: 0.5rem;
  margin: auto 2rem auto 0;
  display: flex;
  width: 30%;
  justify-content: center;
`

const JumpDownArrow = keyframes`
0% {
  top: 0px;
}
50% {
 top: 0.25rem;
}
100% {
  top: 0px;
}
`
const JumpUpArrow = keyframes`
0% {
  bottom: 0px;
}
50% {
 bottom: 0.25rem;
}
100% {
  bottom: 0px;
}
`

const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max-width: 1080px) {
      display: block;
    }
  }
`

const TablesBlockWrapper = styled(Paper)`
  min-width: 150px;
  width: 50%;
  position: relative;
  border-right: 1px solid #30353a;

  && {
    overflow: hidden;
    background-color: #292d31;
    box-shadow: none !important;
  }

  @media (max-width: 1080px) {
    display: ${(props: { show: boolean }) => (props.show ? 'block' : 'none')};
    width: 100%;
    height: calc(100vh - 57px - 70px);
    position: relative;
  }
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const TablesContainer = styled.div`
  position: relative;
  display: flex;
  width: 40%;
  height: calc(100vh - 59px - 80px);
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
    width: 100%;
  }
`

const ChartsContainer = TablesContainer.extend`
  height: calc(100vh - 59px - 80px - 1px);
  justify-content: flex-end;
  flex-direction: column;
  border-right: 1px solid #30353a;
  width: 60%;

  @media (max-width: 1080px) {
    height: calc(100vh - 59px - 80px);
    flex-wrap: nowrap;
  }
`

const ChartsSwitcher = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 38px;
  background: rgb(53, 61, 70);
  color: white;
  border-bottom: 1px solid #818d9ae6;
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

const ExchangesTable = CollapsibleTable.extend`
  bottom: -1px;

  @media (max-width: 1080px) {
    bottom: 0.5rem;
  }
`

const AggregationTable = Table.extend`
  @media (max-width: 1080px) {
    z-index: 1000;
    bottom: 0;
    position: absolute;
    width: 100%;
  }
`

const TriggerRow = Row.extend`
  display: flex;
`

const TriggerTitle = Title.extend`
  cursor: pointer;
`

const StyledArrowSign = styled(MdArrowDropUp)`
  font-size: 1rem;
  transform: ${(props: { up: boolean }) =>
    props.up ? 'rotate(0deg)' : 'rotate(180deg)'};
  position: relative;
  transition: all 0.5s ease;

  ${TriggerRow}:hover & {
    animation: ${(props: { tableCollapsed: boolean }) =>
        props.tableCollapsed ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }

  ${TriggerTitle}:hover & {
    animation: ${(props: { tableCollapsed: boolean }) =>
        props.tableCollapsed ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }
`

const fadeInGreen = keyframes`
0% {
  color: #9ca2aa;
}
50% {
  color: #34cb86d1;
}
100% {
  color: #9ca2aa;
}
`
const fadeInRed = keyframes`
0% {
  color: #9ca2aa;
}
50% {
  color: #d77455;

}
100% {
  color: #9ca2aa;

}
`

const Cell = styled(RowCell)`
  animation: ${(props: { animated?: string; width: string; color: string }) => {
    if (props.animated === 'none') {
      return ''
    }

    if (props.animated === 'green') {
      return `${fadeInGreen} 1.5s ease`
    }

    if (props.animated === 'red') {
      return `${fadeInRed} 1.5s ease`
    }

    return ''
  }};
`

// end of FlexTable

const TogglerContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  font-family: Roboto, sans-serif;
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

  @media (max-width: 1080px) {
    flex-direction: column-reverse;
  }
`

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
  isShownMocks: store.user.isShownMocks,
})

const mapDispatchToProps = (dispatch: any) => ({
  selectExchange: (ex: number) => dispatch(actions.selectExchange(ex)),
})
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(Chart)

export default compose()(storeComponent)
