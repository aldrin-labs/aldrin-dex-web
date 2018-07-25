import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { Collapse } from '@material-ui/core'
import { MdArrowUpward, MdArrowDropUp } from 'react-icons/lib/md'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  HeadCell,
} from '@components/Table/Table'
import AnimatedCell from '@components/Table/AnimatedCell/AnimatedCell'
import { Loading } from '@components/Loading/Loading'
import { Query, Subscription } from 'react-apollo'
import gql from 'graphql-tag'

export interface IProps {
  quote: string
  data: any[]
}

export const MARKET_TICKERS = gql`
  subscription listenMarketTickers($symbol: String!, $exchange: String!) {
    listenMarketTickers(symbol: $symbol, exchange: $exchange)
  }
`

export const MARKET_QUERY = gql`
  query marketTickers($symbol: String!, $exchange: String!) {
    marketTickers(symbol: $symbol, exchange: $exchange)
  }
`

class TickersList extends React.Component {
  state = {
    data: [],
    symbol: 'BTC_USDT',
    exchange: 'binance',
    unsubscribe: null
  }

  static getDerivedStateFromProps(newProps, state) {
    if (newProps.data.marketTickers && (newProps.variables.symbol !== state.symbol || newProps.variables.exchange !== state.exchange)) {
      const tickersData = newProps.data.marketTickers;
      let tickers = []
      for (let i = 0; i < tickersData.length; ++i) {
        const tickerData = JSON.parse(tickersData[i]);
        if (tickerData[1] !== newProps.variables.exchange || tickerData[2] !== newProps.variables.symbol) {
          continue;
        }

        const fall = tickers.length > 0 ? tickers[tickers.length - 1].price > tickerData[3] : false;
        const ticker = {
          size: tickerData[4],
          price: tickerData[3],
          time: tickerData[7],
          fall
        };
        tickers.push(ticker);
      }
      if (state.unsubscribe) {
        console.log('unsubscribe', state.symbol, state.exchange)
        state.unsubscribe(); // unsubscribe
      }
      return ({
        data: tickers,
        symbol: newProps.variables.symbol,
        exchange: newProps.variables.exchange,
        unsubscribe: newProps.subscribeToNewTickers()
      })
    }

    if (newProps.data && newProps.data.marketTickers && newProps.data.marketTickers.length > 0) {
      const tickerData = JSON.parse(newProps.data.marketTickers[0]);
      if (state.data.length > 0 && tickerData[3] === state.data[0].price) {
        return null;
      }
      const fall = state.data.length > 0 ? state.data[0].price > tickerData[3] : false;
      const ticker = {
        size: tickerData[4],
        price: tickerData[3],
        time: new Date(tickerData[7]).toLocaleTimeString(),
        fall
      }

      if (state.data.length > 50) { state.data.pop(); }

      return ({
        data: [ticker, ...state.data],
        symbol: newProps.variables.symbol,
        exchange: newProps.variables.exchange,
        unsubscribe: state.unsubscribe
      })
    }

    return null;
  }

  componentWillUnmount() {
    if (this.state.unsubscribe) {
      this.state.unsubscribe();
    }
  }

  render() {
    return (
      <div>
        {this.state.data.slice(0, 30).map((ticker, i) => {
          //          console.log(ticker);
          return (
            <Row key={i} background={'#25282c'}>
              <AnimatedCell
                animation={
                  ticker.status === 'fall'
                    ? 'fadeInRedAndBack'
                    : 'fadeInGreenAndBack'
                }
                color="#9ca2aa"
                width={'33%'}
                value={ticker.size}
              />

              <AnimatedCell
                animation={
                  ticker.fall ? 'fadeInRed' : 'fadeInGreen'
                }
                color={ticker.fall ? '#d77455' : '#34cb86d1'}
                width={'33%'}
                value={ticker.price}
              >
                <StyledArrow
                  direction={ticker.fall ? 'down' : 'up'}
                />
              </AnimatedCell>
              <AnimatedCell
                animation={
                  ticker.fall
                    ? 'fadeInRedAndBack'
                    : 'fadeInGreenAndBack'
                }
                color="#9ca2aa"
                width={'33%'}
                value={ticker.time}
              />
            </Row>
          )
        })}
      </div>
    );
  };
}

class TradeHistoryTable extends PureComponent<IProps> {
  state = {
    tableExpanded: true,
  }

  render() {
    const { quote, data } = this.props
    const { tableExpanded } = this.state

    const symbol = this.props.currencyPair ? this.props.currencyPair : '';
    const exchange = (this.props.activeExchange && this.props.activeExchange.exchange) ? this.props.activeExchange.exchange.symbol : '';
    console.log('subscribe to ', symbol, exchange);
    if (!data) {
      return <Loading centerAligned />
    }

    return (
      <TradeHistoryTableCollapsible tableExpanded={tableExpanded}>
        <CollapseWrapper in={tableExpanded} collapsedHeight="2rem">
          <TriggerTitle
            onClick={() => {
              this.setState((prevState) => ({
                tableExpanded: !prevState.tableExpanded,
              }))
            }}
          >
            Trade history
            <StyledArrowSign
              variant={{
                tableCollapsed: !tableExpanded,
                up: !tableExpanded,
              }}
              style={{ marginRight: '0.5rem' }}
            />
          </TriggerTitle>
          <Head background={'#25282c'}>
            <Row background={'#25282c'} isHead style={{ height: '100%' }}>
              <HeadCell color="#9ca2aa" width={'33%'}>
                Trade <br /> size
              </HeadCell>
              <HeadCell color="#9ca2aa" width={'33%'}>
                Price<br /> ({quote || 'Fiat'})
              </HeadCell>
              <HeadCell
                style={{ lineHeight: '32px' }}
                color="#9ca2aa"
                width={'33%'}
              >
                Time
              </HeadCell>
            </Row>
          </Head>
          <Body height="400px">
            <Query
              query={MARKET_QUERY}
              variables={{ symbol, exchange }}
            >
              {({ subscribeToMore, ...result }) =>
                (
                  <TickersList
                    {...result}
                    subscribeToNewTickers={() =>
                      subscribeToMore({
                        document: MARKET_TICKERS,
                        variables: { symbol, exchange },
                        updateQuery: (prev, { subscriptionData }) => {
                          if (!subscriptionData.data) { return prev; }
                          const newTicker = subscriptionData.data.listenMarketTickers;
                          let obj = Object.assign({}, prev, {
                            marketTickers: [newTicker]
                          });
                          return obj;
                        }
                      })
                    }
                  />
                )}
            </Query>
          </Body>
        </CollapseWrapper>
      </TradeHistoryTableCollapsible >
    )
  }
}

const StyledBody = Body.extend`
  height: 330px;
  transition: height 0.75s ease-in-out;

  @media (min-width: 1366px) {
    height: 40vh;
  }
  @media (min-width: 1920px) {
    height: 50vh;
  }
`

const TriggerTitle = Title.extend`
  cursor: pointer;
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const CollapsibleTable = Table.extend`
  position: absolute;
  bottom: 0;
  max-height: calc(70% - 37px);
  z-index: 10;
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

const TradeHistoryTableCollapsible = CollapsibleTable.extend`
  max-height: 65%;

  @media (max-width: 1080px) {
    bottom: 0.5rem;
  }
`

const StyledArrowSign = styled(MdArrowDropUp)`
  font-size: 1rem;
  transform: ${(props) =>
    props.variant.up ? 'rotate(0deg)' : 'rotate(180deg)'};
  position: relative;
  transition: all 0.5s ease;

  ${TriggerTitle}:hover & {
    animation: ${(props) =>
    props.variant.tableCollapsed ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }
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

const StyledArrow = styled(MdArrowUpward)`
  min-width: 20%;
  position: absolute;
  right: 0;
  top: calc(50% - 8px);
  transform: ${(props: { direction: string }) =>
    props.direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)'};
`

export default TradeHistoryTable
