import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Paper, Button, Fade, Slide } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import Joyride from 'react-joyride'

import {
  OrderBookTable,
  Aggregation,
  TradeHistoryTable,
  ExchangesTable,
} from '@containers/Chart/Tables/Tables'
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
import { TypographyWithCustomColor } from '@styles/StyledComponents/TypographyWithCustomColor'
import { IProps, IState } from './Chart.types'
import ComingSoon from '@components/ComingSoon'
import { MASTER_BUILD } from '@utils/config'
import { navBarHeight } from '@components/NavBar/NavBar.styles'
import OnlyCharts from '@containers/Chart/OnlyCharts/OnlyCharts'
import MainDepthChart from '@containers/Chart/DepthChart/MainDepthChart/MainDepthChart'
import { singleChartSteps } from '@utils/joyrideSteps'

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
  }

  static getDerivedStateFromProps(nextProps: IProps) {
    const [base, quote] = nextProps.currencyPair.split('_')
    document.title = `${base} to ${quote} | CCAI`

    return null
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
        {MASTER_BUILD && <ComingSoon />}
        <TablesBlockWrapper
          blur={MASTER_BUILD}
          background={theme.palette.background.default}
          rightBorderColor={theme.palette.divider}
          variant={{
            show: showTableOnMobile === 'ORDER',
          }}
        >
          <div>
            <QueryRenderer
              component={OrderBookTable}
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
          </div>
        </TablesBlockWrapper>

        <TablesBlockWrapper
          blur={MASTER_BUILD}
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
    const { palette } = theme
    const { type } = palette

    if (!currencyPair) {
      return
    }
    const [base, quote] = currencyPair.split('_')

    return (
      <Slide
        timeout={{
          enter: 500,
        }}
        direction={'right'}
        in={true}
      >
        <div>
          <Container>
            <ChartsContainer>
              <ChartsSwitcher
                divider={palette.divider}
                background={palette.primary[type]}
              >
                {base &&
                  quote && (
                    <ExchangePair background={palette.primary[type]}>
                      <TypographyWithCustomColor
                        textColor={palette.getContrastText(
                          palette.primary[type]
                        )}
                        variant="subtitle1"
                      >
                        {`${base}/${quote}`}
                      </TypographyWithCustomColor>
                    </ExchangePair>
                  )}
                <SwitchButtonWrapper>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => {
                      this.setState((prevState) => ({
                        activeChart:
                          prevState.activeChart === 'candle'
                            ? 'depth'
                            : 'candle',
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
                    {MASTER_BUILD && <ComingSoon />}
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
        </div>
      </Slide>
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
    const {
      toggleView,
      view,
      isNoCharts,
      activeExchange,
      currencyPair,
      addChart,
    } = this.props

    const defaultView = view === 'default'

    return (
      <Toggler
        variant="raised"
        color="primary"
        onClick={() => {
          toggleView(defaultView ? 'onlyCharts' : 'default')
          if (defaultView && isNoCharts) addChart(currencyPair)
        }}
      >
        {defaultView ? 'Multi Charts' : ' Single Chart'}
      </Toggler>
    )
  }

  render() {
    const { view, currencyPair, activeExchange } = this.props

    const toggler = this.renderToggler()

    return (
      <MainContainer fullscreen={view !== 'default'}>
        <TogglerContainer>
          <AutoSuggestSelect
            value={view === 'default' && currencyPair}
            id={'currencyPair'}
            view={view}
            exchange={activeExchange}
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
  ${(props: { fullscreen: boolean }) => props.fullscreen && 'height: 100vh'};
  @media (min-width: 1900px) {
    margin-top: -0.75rem;
  }
`
const DepthChartContainer = styled.div`
  height: calc(100vh - 59px - ${navBarHeight}px - 38px);
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
  ${(props: { blur?: boolean }) => (props.blur ? 'filter: blur(5px);' : '')}
  border-right: 1px solid
    ${(props: { rightBorderColor?: string }) => props.rightBorderColor};

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

const TablesContainer = styled.div`
  position: relative;
  display: flex;
  width: 40%;
  height: calc(100vh - 59px - ${navBarHeight}px);
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
    width: 100%;
  }
`

const ChartsContainer = styled(TablesContainer)`
  height: calc(100vh - 59px - ${navBarHeight}px);
  justify-content: flex-end;
  flex-direction: column;
  border-right: 1px solid #30353a;
  width: 60%;

  @media (max-width: 1080px) {
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
  background: ${(props: { background: string }) => props.background};
  color: white;
  border-bottom: 1px solid
    ${(props: { divider: string; background: string }) => props.divider};
`

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
    flex-direction: column;
  }
`

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
  isNoCharts: store.chart.charts.length === 0,
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
})
const ThemeWrapper = (props) => <Chart {...props} />
const ThemedChart = withTheme()(ThemeWrapper)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemedChart)
