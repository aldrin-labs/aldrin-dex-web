import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Paper, Button } from '@material-ui/core'

import {
  OrderBookTable,
  SpreadTable,
  Aggregation,
  TradeHistoryTable,
  ExchangesTable,
} from './Tables/Tables'
import * as actions from './actions'
import { SingleChart } from '@components/Chart'
import OnlyCharts from './OnlyCharts/OnlyCharts'
import { exchanges, orders, getFakeDepthChartData, orderBook } from './mocks'
import Switch from '@components/Switch/Switch'
import DepthChart from './DepthChart/DepthChart'
import AutoSuggestSelect from './Inputs/AutoSuggestSelect/AutoSuggestSelect'

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

class Chart extends React.Component<IState> {
  state: IState = {
    view: 'default',
    orders,
    exchangeTableCollapsed: true,
    aggregation: 0.01,
    showTableOnMobile: 'ORDER',
    activeChart: 'depth',
    currencyPairRaw: '',
    ordersData: [],
    spreadData: [],
    exchanges: [],
    tradeHistory: [],
  }

  componentDidMount() {
    const { isShownMocks } = this.props
    const { usdSpreadFakeData, orderBookFakeData } = getFakeDepthChartData()

    if (isShownMocks) {
      this.setState({
        ordersData: orderBookFakeData,
        exchanges,
        spreadData: usdSpreadFakeData,
        usdSpreadFakeData,
        orderBookFakeData,
      })
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

  renderTables: any = () => {
    const {
      aggregation,
      showTableOnMobile,

      tradeHistory,
      ordersData,
      spreadData,
    } = this.state
    const { currencyPair } = this.props

    let base
    let quote
    if (currencyPair) {
      base = currencyPair.split('/')[0]
      quote = currencyPair.split('/')[1]
    }

    const { activeExchange } = this.props
    const { changeExchange } = this

    return (
      <TablesContainer>
        <TablesBlockWrapper show={showTableOnMobile === 'ORDER'}>
          <OrderBookTable
            {...{
              onButtonClick: this.changeTable,
              data: ordersData,
              roundTill: this.roundTill,
              aggregation,
              base,
            }}
          />

          <SpreadTable
            {...{
              roundTill: this.roundTill,
              data: spreadData,
              aggregation,
              base,
            }}
          />

          <Aggregation
            {...{
              aggregation: this.state.aggregation,
              onButtonClick: this.setAggregation,
            }}
          />
        </TablesBlockWrapper>

        <TablesBlockWrapper show={showTableOnMobile === 'TRADE'}>
          <ExchangesTable
            {...{
              exchanges,
              activeExchange,
              changeExchange,
              base,
            }}
          />

          <TradeHistoryTable
            {...{
              data: orderBook,
              onButtonClick: this.changeTable,
              base,
            }}
          />
        </TablesBlockWrapper>
      </TablesContainer>
    )
  }

  renderDefaultView = () => {
    const { ordersData, spreadData } = this.state
    const { currencyPair } = this.props

    let base
    let quote
    if (currencyPair) {
      base = currencyPair.split('/')[0]
      quote = currencyPair.split('/')[1]
    }

    return (
      <Container>
        <ChartsContainer>
          <ChartsSwitcher>
            <ExchangePair>{`${base}/${quote}`}</ExchangePair>
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
                  ordersData,
                  spreadData,
                  base,
                  quote,
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

  handleChange = (name) => (value) => {
    this.setState({
      [name]: value,
    })
  }

  renderToggler = () => {
    const { view } = this.state

    if (view === 'default') {
      return (
        <Toggler onClick={() => this.onToggleView('onlyCharts')}>
          Multi Charts
        </Toggler>
      )
    }
    if (view === 'onlyCharts') {
      return (
        <Toggler onClick={() => this.onToggleView('default')}>
          Single Chart
        </Toggler>
      )
    }

    return null
  }

  render() {
    const { view, currencyPairRaw } = this.state
    const toggler = this.renderToggler()

    return (
      <MainContainer>
        <TogglerContainer>
          {/* <SelectCurrencies
            handleSelect={this.props.selectCurrencies}
            value={[base, quote]}
          /> */}

          <AutoSuggestSelect
            handleChange={this.handleChange}
            value={currencyPairRaw}
            id={'currencyPairRaw'}
          />

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

const ExchangePair = styled.div`
  margin: 0 0.5rem;
  background: #2e353fd9;
  line-height: 36px;
  white-space: nowrap;
  border-radius: 3px;
  height: 100%;
  padding: 0 1rem;
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
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 38px;
  background: rgb(53, 61, 70);
  color: white;
  border-bottom: 1px solid #818d9ae6;
`

// end of FlexTable

const TogglerContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  font-family: Roboto, sans-serif;
`

const Toggler = styled(Button)`
  && {
    margin: 0.7rem;
  }
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
  currencyPair: store.chart.currencyPair,
  isShownMocks: store.user.isShownMocks,
})

const mapDispatchToProps = (dispatch: any) => ({
  selectExchange: (ex: number) => dispatch(actions.selectExchange(ex)),
  selectCurrencies: (baseQuote: string) =>
    dispatch(actions.selectCurrencies(baseQuote)),
})
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(Chart)

export default storeComponent
