import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { Collapse } from '@material-ui/core'
import { MdArrowUpward, MdArrowDropUp } from 'react-icons/lib/md/'

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
  query marketTickers {
    marketTickers
  }
`

class TickersList extends React.Component {
  state = {
    data: []
  }
  componentWillMount() {
    setTimeout(() => {
      console.log('subscribeToNewTickers');
      this.props.subscribeToNewTickers();
    }, 3000);
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    if (newProps.data && newProps.data.marketTickers && newProps.data.marketTickers.length === 0) {
      console.log(newProps);
      return this.setState((prevState, props) =>
        ({ data: [] }));
    }

    if (newProps.data && newProps.data.marketTickers && newProps.data.marketTickers.length > 0) {
      console.log(newProps);
      const ticker = JSON.parse(newProps.data.marketTickers[0]);
      console.log(ticker);
      this.setState((prevState, props) => {
        if (prevState.data.length > 50) { prevState.data.pop(); }
        return ({ data: [ticker, ...prevState.data] })
      });
    }
  }
  render() {
    return (
      <div>
        {this.state.data.slice(0, 30).map((ticker, i) => (
          <Row key={i} background={'#25282c'}>
            <AnimatedCell
              animation={
                ticker.status === 'fall'
                  ? 'fadeInRedAndBack'
                  : 'fadeInGreenAndBack'
              }
              color="#9ca2aa"
              width={'33%'}
              value={ticker.size.toFixed(8)}
            />

            <AnimatedCell
              animation={
                ticker.status === 'fall' ? 'fadeInRed' : 'fadeInGreen'
              }
              color={ticker.status === 'fall' ? '#d77455' : '#34cb86d1'}
              width={'33%'}
              value={Number(ticker.price).toFixed(2)}
            >
              <StyledArrow
                direction={ticker.status === 'fall' ? 'down' : 'up'}
              />
            </AnimatedCell>
            <AnimatedCell
              animation={
                ticker.status === 'fall'
                  ? 'fadeInRedAndBack'
                  : 'fadeInGreenAndBack'
              }
              color="#9ca2aa"
              width={'33%'}
              value={ticker.time}
            />
          </Row>
        ))}
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

    console.log(this.props);
    const symbol = this.props.currencyPair ? this.props.currencyPair : 'ETH_BTC';
    const exchange = (this.props.activeExchange && this.props.activeExchange.exchange) ? this.props.activeExchange.exchange.symbol : 'gateio';
    console.log('subscribe to ', symbol, exchange);
    if (!data) {
      return <Loading centerAligned />
    }

    return (
      <TradeHistoryTableCollapsible>
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
                          console.log(newTicker)
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
      </TradeHistoryTableCollapsible>
    )
  }
}

const TriggerTitle = Title.extend`
  cursor: pointer;
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const CollapsibleTable = Table.extend`
  position: absolute;
  bottom: 0;
  max-height: calc(50% - 37px);
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
