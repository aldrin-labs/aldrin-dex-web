import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from '@material-ui/core'
import { Query, Subscription } from 'react-apollo'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell as RowCell,
  HeadCell,
} from '@components/Table/Table'
import AnimatedCell from '@components/Table/AnimatedCell/AnimatedCell'
import { Loading } from '@components/Loading/Loading'
import gql from 'graphql-tag'

export const MARKET_ORDERS = gql`
  subscription listenMarketOrders($symbol: String!, $exchange: String!) {
    listenMarketOrders(symbol: $symbol, exchange: $exchange)
  }
`

export const MARKET_QUERY = gql`
  query marketOrders {
    marketOrders
  }
`

class OrdersList extends React.Component {
  state = {
    data: []
  }
  componentWillMount() {
    this.props.subscribeToNewOrders();
  }

  componentWillReceiveProps(newProps) {
    // console.log(newProps);
    if (newProps.data && newProps.data.marketOrders && newProps.data.marketOrders.length === 0) {
      // console.log(newProps);
      return this.setState((prevState, props) =>
        ({ data: [] }));
    }

    if (newProps.data && newProps.data.marketOrders && newProps.data.marketOrders.length > 0) {
      // console.log(newProps);
      const order = newProps.data.marketOrders[0];
      return this.setState((prevState, props) => {
        if (prevState.data.length > 20) { prevState.data.pop(); }
        return ({ data: [order, ...prevState.data] })
      });
    }
  }
  render() {
    return (
      <div>
        {
          this.state.data.map((order, i) => (
            <Row key={i} background={'#292d31'}>
              <EmptyCell
                status={'rise'}
                colored={order.percentageOfChange ? order.percentageOfChange.toString() : "0"}
                color="#9ca2aa"
                width={'25%'}
              />

              <AnimatedCell
                value={Number(order.size).toFixed(8)}
                color="#9ca2aa"
                animation={'fadeInGreenAndBack'}
                width={'35%'}
              />
              <AnimatedCell
                value={this.props.roundTill(
                  this.props.aggregation,
                  Number(order.price).toFixed(8)
                ).toFixed(2)}
                animation={'fadeInGreen'}
                color="#34cb86d1"
                width={'30%'}
              />
            </Row>
          ))
        }
      </div>
    );
  };
}

class OrderBookTable extends PureComponent {
  render() {
    const { onButtonClick, roundTill, aggregation, quote, data } = this.props
    console.log(this.props);
    const symbol = this.props.currencyPair ? this.props.currencyPair : 'ETH_BTC';
    const exchange = (this.props.activeExchange && this.props.activeExchange.exchange) ? this.props.activeExchange.exchange.symbol : 'gateio';
    console.log('subscribe to ', symbol, exchange);
    if (!data) {
      return <Loading centerAligned />
    }

    return (
      <Table>
        <Title>
          Order Book
          <SwitchTablesButton
            onClick={onButtonClick}
            variant="outlined"
            color="primary"
          >
            HISTORY
          </SwitchTablesButton>
        </Title>
        <Head background={'#292d31'}>
          <Row isHead background={'#292d31'}>
            <EmptyCell color="#9ca2aa" width={'20%'} />
            <HeadCell
              style={{
                position: 'relative',
                left: '5%',
              }}
              color="#9ca2aa"
              width={'35%'}
            >
              Market <br /> Size
            </HeadCell>
            <HeadCell
              color="#9ca2aa"
              style={{
                position: 'relative',
                left: '12%',
                overflow: 'visible',
              }}
              width={'16%'}
            >
              Price<br />({quote || 'Fiat'})
            </HeadCell>
          </Row>
        </Head>
        <Body height={'calc(100vh - 59px - 80px - 39px - 37px - 24px - 26px)'}>
          <Query
            query={MARKET_QUERY}
          >
            {({ subscribeToMore, ...result }) =>
              (
                <OrdersList
                  roundTill={roundTill}
                  aggregation={aggregation}
                  {...result}
                  subscribeToNewOrders={() =>
                    subscribeToMore({
                      document: MARKET_ORDERS,
                      variables: { symbol, exchange },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) { return prev; }
                        const newOrder = JSON.parse(subscriptionData.data.listenMarketOrders);
                        // console.log(newOrder)
                        let obj = Object.assign({}, prev, {
                          marketOrders: [newOrder]
                        });
                        return obj;
                      }
                    })
                  }
                />
              )}
          </Query>
        </Body>
      </Table>
    )
  }
}

const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media(max - width: 1080px) {
  display: block;
}
  }
`

const fadeInGreen = keyframes`
0 % {
  color: #9ca2aa;
}
50 % {
  color: #34cb86d1;
}
100 % {
  color: #9ca2aa;
}
  `
const fadeInRed = keyframes`
0 % {
  color: #9ca2aa;
}
50 % {
  color: #d77455;

}
100 % {
  color: #9ca2aa;

}
  `

const Cell = styled(RowCell)`
animation: ${
  (props: { animated?: string; width: string; color: string }) => {
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
  }
  };
`

const EmptyCell = Cell.extend`
position: relative;

  &: before {
  transition: all 0.5s linear;
  position: absolute;
  z - index: 100;
  top: 0;
  left: 0;
  width: ${ (props: { colored?: string }) => Number(props.colored) / 4}%;
  height: 100 %;
  content: '';
  background - color: ${
  (props: { status?: string; colored?: string }) =>
    props.status === 'fall' ? '#d77455' : '#34cb86d1'
  };
}
`

export default OrderBookTable
