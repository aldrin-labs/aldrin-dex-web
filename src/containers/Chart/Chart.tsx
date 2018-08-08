import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Paper, Button, Typography, Fade } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'

import {
  OrderBookTable,
  Aggregation,
  TradeHistoryTable,
  ExchangesTable,
} from '@containers/Chart/Tables/Tables'
import TablePlaceholder from '@components/TablePlaceholderLoader'
import {
  ExchangeQuery,
  MARKET_TICKERS,
  MARKET_QUERY,
  updateTradeHistoryQuerryFunction,
  ORDERS_MARKET_QUERY,
  MARKET_ORDERS,
  updateOrderBookQuerryFunction,
} from './api'
import QueryRenderer from '@components/QueryRenderer'
import * as actions from '@containers/Chart/actions'
import { SingleChart } from '@components/Chart'
import OnlyCharts from '@containers/Chart/OnlyCharts/OnlyCharts'
import { orders } from '@containers/Chart/mocks'
import DepthChart from '@containers/Chart/DepthChart/DepthChart'
import AutoSuggestSelect from '@containers/Chart/Inputs/AutoSuggestSelect/AutoSuggestSelect'

class Chart extends React.Component {
  state = {
    view: 'default',
    orders,
    exchangeTableCollapsed: true,
    aggregation: 0.01,
    showTableOnMobile: 'ORDER',
    activeChart: 'candle',
    exchanges: [],
    tradeHistory: [],
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

  changeExchange = (i: any) => {
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
    const { aggregation, showTableOnMobile } = this.state
    const { currencyPair } = this.props

    let quote
    if (currencyPair) {
      quote = currencyPair.split('_')[1]
    }

    const { activeExchange, theme } = this.props
    const { changeExchange } = this

    const symbol = currencyPair || ''
    const exchange =
      activeExchange && activeExchange.exchange
        ? activeExchange.exchange.symbol
        : ''

    return (
      <TablesContainer>
        <TablesBlockWrapper
          background={theme.palette.background.default}
          rightBorderColor={theme.palette.divider}
          variant={{
            show: showTableOnMobile === 'ORDER',
          }}
        >
          <QueryRenderer
            component={OrderBookTable}
            query={ORDERS_MARKET_QUERY}
            variables={{ symbol, exchange }}
            renderWithPlaceholder
            placeholder={TablePlaceholder}
            subscriptionArgs={{
              subscription: MARKET_ORDERS,
              variables: { symbol, exchange },
              updateQueryFunction: updateOrderBookQuerryFunction,
            }}
            {...{
              onButtonClick: this.changeTable,
              roundTill: this.roundTill,
              activeExchange,
              currencyPair,
              aggregation,
              quote,
              symbol,
              exchange,
              ...this.props,
            }}
          />

          <Aggregation
            {...{
              theme,
              aggregation: this.state.aggregation,
              onButtonClick: this.setAggregation,
            }}
          />
        </TablesBlockWrapper>

        <TablesBlockWrapper
          background={theme.palette.background.default}
          rightBorderColor={theme.palette.divider}
          variant={{
            show: showTableOnMobile === 'TRADE',
          }}
        >
          <QueryRenderer
            component={ExchangesTable}
            query={ExchangeQuery}
            variables={{ marketName: currencyPair }}
            renderWithPlaceholder
            placeholder={TablePlaceholder}
            {...{
              activeExchange,
              changeExchange,
              quote,
              theme,
              onButtonClick: this.changeTable,
              ...this.props,
            }}
          />

          <QueryRenderer
            component={TradeHistoryTable}
            query={MARKET_QUERY}
            variables={{ symbol, exchange }}
            renderWithPlaceholder
            placeholder={() => <TablePlaceholder margin={'20% 0px 0px'} />}
            subscriptionArgs={{
              subscription: MARKET_TICKERS,
              variables: { symbol, exchange },
              updateQueryFunction: updateTradeHistoryQuerryFunction,
            }}
            {...{
              quote,
              activeExchange,
              theme,
              currencyPair,
              symbol,
              exchange,
              ...this.props,
            }}
          />
        </TablesBlockWrapper>
      </TablesContainer>
    )
  }

  renderDefaultView = () => {
    const { ordersData, spreadData, activeChart } = this.state
    const {
      activeExchange,
      currencyPair,
      theme: { palette },
    } = this.props

    const symbol = currencyPair || ''
    const exchange =
      activeExchange && activeExchange.exchange
        ? activeExchange.exchange.symbol
        : ''

    let base
    let quote
    if (currencyPair) {
      base = currencyPair.split('_')[0]
      quote = currencyPair.split('_')[1]
    }

    return (
      <Container>
        <ChartsContainer>
          <ChartsSwitcher
            divider={palette.divider}
            background={palette.primary.main}
          >
            {base &&
              quote && (
                <ExchangePair background={palette.primary.dark}>
                  <Typography variant="subheading" color="secondary">
                    {`${base}/${quote}`}
                  </Typography>
                </ExchangePair>
              )}
            <SwitchButtonWrapper>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  this.setState((prevState) => ({
                    activeChart:
                      prevState.activeChart === 'candle' ? 'depth' : 'candle',
                  }))
                }}
              >
                {activeChart === 'candle' ? 'show depth' : 'show chart'}
              </Button>
            </SwitchButtonWrapper>
          </ChartsSwitcher>
          {activeChart === 'candle' ? (
            <SingleChart additionalUrl={`/?symbol=${base}/${quote}`} />
          ) : (
            <Fade timeout={1000} in={activeChart === 'depth'}>
              <DepthChartContainer>
                <QueryRenderer
                  component={DepthChart}
                  query={ORDERS_MARKET_QUERY}
                  variables={{ symbol, exchange }}
                  // subscriptionArgs={{
                  //   subscription: MARKET_ORDERS,
                  //   variables: { symbol, exchange },
                  //   updateQueryFunction: updateOrderBookQuerryFunction,
                  // }}
                  {...{
                    base,
                    quote,
                    animated: false,
                  }}
                />
              </DepthChartContainer>
            </Fade>
          )}
        </ChartsContainer>

        {this.renderTables()}
      </Container>
    )
  }

  renderOnlyCharts = () => <OnlyCharts />

  renderToggler = () => {
    const { toggleView, view } = this.props

    if (view === 'default') {
      return (
        <Toggler onClick={() => toggleView('onlyCharts')}>Multi Charts</Toggler>
      )
    }
    if (view === 'onlyCharts') {
      return (
        <Toggler onClick={() => toggleView('default')}>Single Chart</Toggler>
      )
    }

    return null
  }

  render() {
    const { view, currencyPair } = this.props

    const toggler = this.renderToggler()

    return (
      <MainContainer>
        <TogglerContainer>
          <AutoSuggestSelect
            value={currencyPair}
            id={'currencyPair'}
            view={view}
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

  @media (min-width: 1900px) {
    margin-top: -0.75rem;
  }
`
const DepthChartContainer = styled.div`
  height: calc(100vh - 59px - 80px - 38px);
  width: 100%;
`

const SwitchButtonWrapper = styled.div`
  margin: 1rem;
`

const ExchangePair = styled.div`
  margin: 0 0.5rem;
  background: ${(props: { background: string }) => props.background};
  display: flex;
  place-items: center;
  white-space: nowrap;
  border-radius: 3px;
  height: 100%;
  padding: 0 1rem;
`

const TablesBlockWrapper = styled(Paper)`
  min-width: 150px;
  width: 50%;
  position: relative;
  border-right: 1px solid
    ${(props: { rightBorderColor?: string }) => props.rightBorderColor};

  && {
    overflow: hidden;
    background-color: ${(props: { background: string }) => props.background};
    box-shadow: none !important;
  }

  @media (max-width: 1080px) {
    display: ${(props: { variant: { show: boolean } }) =>
      props.variant.show ? 'block' : 'none'};
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
  background: ${(props) => props.background};
  color: white;
  border-bottom: 1px solid ${(props) => props.divider};
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
  view: store.chart.view,
  currencyPair: store.chart.currencyPair,
  isShownMocks: store.user.isShownMocks,
})

const mapDispatchToProps = (dispatch: any) => ({
  selectExchange: (ex: any) => dispatch(actions.selectExchange(ex)),
  toggleView: (view: 'default' | 'onlyCharts') =>
    dispatch(actions.toggleView(view)),
  selectCurrencies: (baseQuote: string) =>
    dispatch(actions.selectCurrencies(baseQuote)),
})
const ThemeWrapper = (props) => <Chart {...props} />
const ThemedChart = withTheme()(ThemeWrapper)
const storeComponent = connect(mapStateToProps, mapDispatchToProps)(ThemedChart)

export default storeComponent
