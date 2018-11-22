import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Button, Fade, Typography, Card, Grid, Slide } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import Joyride from 'react-joyride'

import {
  OrderBookTable,
  Aggregation,
  TradeHistoryTable,
  ExchangesTable,
} from '@containers/Chart/Tables/Tables'
import * as userActions from '@containers/User/actions'
import TablePlaceholderLoader from '@components/TablePlaceholderLoader'
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
import { orders } from '@containers/Chart/mocks'
import AutoSuggestSelect from '@containers/Chart/Inputs/AutoSuggestSelect/AutoSuggestSelect'
import { IProps, IState } from './Chart.types'
import { navBarHeight } from '@components/NavBar/NavBar.styles'
import OnlyCharts from '@containers/Chart/OnlyCharts/OnlyCharts'
import MainDepthChart from '@containers/Chart/DepthChart/MainDepthChart/MainDepthChart'
import { singleChartSteps } from '@utils/joyrideSteps'
import { setTimeout } from 'timers'
import { withErrorFallback } from '@hoc/index'
import TransparentExtendedFAB from '@components/TransparentExtendedFAB'

class Chart extends React.Component<IProps, IState> {
  state = {
    view: 'default',
    orders,
    exchangeTableCollapsed: true,
    aggregation: 0.01,
    showTableOnMobile: 'ORDER',
    activeChart: 'candle',
    exchanges: [],
    tradeHistory: [],
    joyride: false,
  }

  static getDerivedStateFromProps(nextProps: IProps) {
    const [base, quote] = nextProps.currencyPair.split('_')
    document.title = `${base} to ${quote} | CCAI`

    return null
  }

  componentDidMount() {
    if (!this.state.joyride) {
      setTimeout(() => {
        this.setState({ joyride: true })
      }, 1000)
    }
  }

  componentWillUnmount() {
    document.title = 'Cryptocurrencies AI'
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

  handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    )
      this.props.hideToolTip('chartPage')
  }

  renderTables: any = () => {
    const { aggregation, showTableOnMobile } = this.state
    const { currencyPair } = this.props

    let quote
    if (currencyPair) {
      quote = currencyPair.split('_')[1]
    }

    const { activeExchange, theme, demoMode } = this.props
    const { changeExchange } = this

    const symbol = currencyPair || ''
    const exchange =
      activeExchange && activeExchange.exchange
        ? activeExchange.exchange.symbol
        : ''

    return (
      <TablesContainer item sm={4}>
        <Joyride
          showProgress={true}
          showSkipButton={true}
          continuous={true}
          steps={singleChartSteps}
          run={this.state.joyride && demoMode.chartPage}
          callback={this.handleJoyrideCallback}
          styles={{
            options: {
              backgroundColor: theme.palette.common.white,
              primaryColor: theme.palette.secondary.main,
              textColor: theme.palette.primary.main,
            },
            tooltip: {
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSize,
            },
          }}
        />
        <TablesBlockWrapper
          blur={false}
          background={theme.palette.background.default}
          rightBorderColor={theme.palette.divider}
          variant={{
            show: showTableOnMobile === 'ORDER',
          }}
        >
          <QueryRenderer
            component={OrderBookTable}
            withOutSpinner
            query={ORDERS_MARKET_QUERY}
            fetchPolicy="network-only"
            variables={{ symbol, exchange }}
            placeholder={TablePlaceholderLoader}
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
              setOrders: this.props.setOrders,
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
          className="ExchangesTable"
          blur={false}
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
            placeholder={TablePlaceholderLoader}
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
            placeholder={() => (
              <TablePlaceholderLoader margin={'20% 0px 0px'} />
            )}
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
    const { activeChart } = this.state
    const { currencyPair, theme } = this.props

    if (!currencyPair) {
      return
    }
    const [base, quote] = currencyPair.split('_')

    return (
      <Container container spacing={16}>
        <ChartsContainer item sm={8}>
          {activeChart === 'candle' ? (
            <SingleChart additionalUrl={`/?symbol=${base}/${quote}`} />
          ) : (
            <Fade timeout={1000} in={activeChart === 'depth'}>
              <DepthChartContainer>
                <MainDepthChart
                  {...{
                    theme,
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

  renderOnlyCharts = () => (
    <OnlyCharts
      {...{
        theme: this.props.theme,
        mainPair: this.props.currencyPair,
        view: this.props.view,
      }}
    />
  )

  renderToggler = () => {
    const { toggleView, view, isNoCharts, currencyPair, addChart } = this.props

    const defaultView = view === 'default'

    return (
      <Toggler>
        <TransparentExtendedFAB
          onClick={() => {
            toggleView(defaultView ? 'onlyCharts' : 'default')
            if (defaultView && isNoCharts) addChart(currencyPair)
          }}
        >
          {defaultView ? 'Multi Charts' : ' Single Chart'}
        </TransparentExtendedFAB>
      </Toggler>
    )
  }

  render() {
    const { view, currencyPair, activeExchange, theme } = this.props
    const { activeChart } = this.state
    const { palette } = theme

    if (!currencyPair) {
      return
    }
    const [base, quote] = currencyPair.split('_')
    const toggler = this.renderToggler()

    return (
      <MainContainer fullscreen={view !== 'default'}>
        <TogglerContainer container className="AutoSuggestSelect">
          <Slide
            direction="top"
            in={base && quote && view === 'default'}
            mountOnenter
            unMountOnExit
          >
            <Grid
              spacing={16}
              item
              sm={8}
              xs={6}
              container
              alignItems="center"
              justify="flex-end"
            >
              <ExchangePair border={palette.divider}>
                {
                  <Typography
                    style={{ margin: 'auto' }}
                    align="center"
                    color="default"
                    variant="button"
                  >
                    {`${base}/${quote}`}
                  </Typography>
                }
              </ExchangePair>
              <Button
                style={{ height: 38, marginLeft: '1.5rem' }}
                variant="extendedFab"
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
            </Grid>
          </Slide>

          <Grid
            alignItems="center"
            item
            xs={6}
            sm={4}
            container
            justify="flex-end"
          >
            <AutoSuggestSelect
              value={view === 'default' && currencyPair}
              id={'currencyPair'}
              view={view}
              exchange={activeExchange}
            />

            {toggler}
          </Grid>
        </TogglerContainer>
        {view === 'default' && this.renderDefaultView()}
        {view === 'onlyCharts' && this.renderOnlyCharts()}
      </MainContainer>
    )
  }
}

const MainContainer = styled.div`
  ${(props: { fullscreen: boolean }) => props.fullscreen && 'height: 100vh'};
  @media (min-width: 1900px) {
    margin-top: -0.75rem;
  }
`
const DepthChartContainer = styled(Card)`
  height: 100%;
  width: 100%;
`

export const ExchangePair = styled.div`
  border-radius: 24px;
  border: 1px solid ${(props: { border: string }) => props.border};
  padding: 0 16px;
  height: 38px;
  place-content: center;
  display: flex;
  width: 130px;
  background: transparent;
`

const TablesBlockWrapper = styled(Card)`
  min-width: 150px;
  width: 50%;
  position: relative;
  ${(props: { blur?: boolean }) => (props.blur ? 'filter: blur(5px);' : '')}

  && {
    overflow: hidden;
    background-color: ${(props: { background?: string }) => props.background};
    box-shadow: none !important;
  }

  @media (max-width: 1080px) {
    display: ${(props: { variant: { show?: boolean } }) =>
      props.variant.show ? 'block' : 'none'};
    width: 100%;
    height: calc(100vh - 57px - 70px);
    position: relative;
  }
`

const TablesContainer = styled(Grid)`
  position: relative;
  display: flex;

  height: calc(100vh - 59px - ${navBarHeight}px);
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`

const ChartsContainer = styled(TablesContainer)`
  height: calc(100vh - 59px - ${navBarHeight}px);
  justify-content: flex-end;
  flex-direction: column;
  width: 60%;

  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }
`

// margin for centring
const TogglerContainer = styled(Grid)`
  margin-bottom: -8px;
  height: 4rem;
  width: 100%;
`

const Toggler = styled.div`
  && {
    margin: 0.7rem;
  }
`

const Container = styled(Grid)`
  width: 100%;
  margin: 0;
`

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
  isNoCharts: store.chart.charts.length === 0,
  demoMode: store.user.toolTip,
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
  addChart: (payload) => dispatch(actions.addChart(payload)),
  setOrders: (payload) => dispatch(actions.setOrders(payload)),
  hideToolTip: (tab: string) => dispatch(userActions.hideToolTip(tab)),
})
const ThemeWrapper = (props) => <Chart {...props} />
const ThemedChart = withTheme()(ThemeWrapper)

export default withErrorFallback(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ThemedChart)
)
