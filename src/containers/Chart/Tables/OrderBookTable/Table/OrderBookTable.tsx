import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button, Typography } from '@material-ui/core'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell,
  HeadCell,
} from '@components/Table/Table'
import AnimatedCell from '@components/Table/AnimatedCell/AnimatedCell'
import { Loading } from '@components/Loading/Loading'

class OrdersList extends React.Component {
  state = {
    bids: [],
    asks: [],
    symbol: '',
    exchange: '',
    unsubscribe: null,
  }

  static getDerivedStateFromProps(newProps, state) {
    if (
      newProps.data.marketOrders &&
      (newProps.variables.symbol !== state.symbol ||
        newProps.variables.exchange !== state.exchange)
    ) {
      if (state.unsubscribe) {
        // console.log('order unsubscribe', state.symbol, state.exchange)
        state.unsubscribe() // unsubscribe
      }
      const orders = newProps.data.marketOrders
        .filter((x) => !x.exchange)
        .map((x) => JSON.parse(x))
      let asks = orders
        .filter((x) => x.type === 'ask')
        .sort((a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0))
      asks = asks.slice(asks.length - 30, asks.length)
      return {
        asks,
        bids: orders
          .filter((x) => x.type === 'bid')
          .sort((a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0))
          .slice(0, 30),
        symbol: newProps.variables.symbol,
        exchange: newProps.variables.exchange,
        unsubscribe: newProps.subscribeToNewOrders(),
      }
    }

    if (
      newProps.data &&
      newProps.data.marketOrders &&
      newProps.data.marketOrders.length > 0
    ) {
      const orderData = newProps.data.marketOrders[0]
      let order = {
        price: Number(orderData.price).toFixed(8),
        size: Number(orderData.size).toFixed(8),
        side: orderData.side,
      }

      // TODO: next here we should increase or decrease size of existing orders, not just replace them
      if (order.side === 'bid') {
        const ind = state.bids.findIndex((i) => i.price === order.price)
        if (ind > -1) {
          if (order.size !== '0') {
            state.bids.splice(ind, 1, order)
          } else {
            state.bids.splice(ind, 1)
          }
          order = null
        }
      }
      if (order !== null && order.side === 'ask') {
        const ind = state.asks.findIndex((i) => i.price === order.price)
        if (ind > -1) {
          if (order.size !== '0') {
            state.asks.splice(ind, 1, order)
          } else {
            state.asks.splice(ind, 1)
          }
          order = null
        }
      }
      if (order !== null) {
        state.bids =
          order.side === 'bid'
            ? [order, ...state.bids].sort(
                (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
              )
            : state.bids
        state.asks =
          order.side === 'ask'
            ? [order, ...state.asks].sort(
                (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0)
              )
            : state.asks
      }

      if (state.bids.length > 30) {
        state.bids.pop()
      }
      if (state.asks.length > 30) {
        state.asks.pop()
      }

      return {
        bids: [...state.bids],
        asks: [...state.asks],
        symbol: newProps.variables.symbol,
        exchange: newProps.variables.exchange,
      }
    }

    return null
  }

  componentWillUnmount() {
    if (this.state.unsubscribe) {
      this.state.unsubscribe()
    }
  }

  render() {
    const spread =
      this.state.asks.length > 0 && this.state.bids.length > 0
        ? this.state.asks[this.state.asks.length - 1].price -
          this.state.bids[0].price
        : 0
    return (
      <div>
        <Body height="450px">
          {this.state.asks.map((order, i) => (
            <Row key={i} background={'#292d31'}>
              <EmptyCell
                status={'rise'}
                colored={
                  order.percentageOfChange
                    ? order.percentageOfChange.toString()
                    : '0'
                }
                color="#dd8b87"
                width={'25%'}
              />

              <AnimatedCell
                value={order.size}
                color="#dd8b87"
                animation={'fadeInRed'}
                width={'35%'}
              />
              <AnimatedCell
                value={order.price}
                animation={'fadeInRed'}
                color="#e0514ad1"
                width={'30%'}
              />
            </Row>
          ))}
        </Body>
        <Head
          background={'#292d31'}
          style={{ cursor: 'pointer', height: '1.625rem' }}
        >
          <Row isHead background={'#292d31'}>
            <HeadCell
              style={{
                position: 'relative',
                left: '5%',
              }}
              color="#9ca2aa"
              width={'35%'}
            >
              Spread{' '}
            </HeadCell>
            <HeadCell
              style={{
                position: 'relative',
                left: '13%',
              }}
              color="#9ca2aa"
              width={'14%'}
            >
              {spread}
            </HeadCell>
          </Row>
        </Head>
        <Body height="550px">
          {this.state.bids.map((order, i) => (
            <Row key={i} background={'#292d31'}>
              <EmptyCell
                status={'rise'}
                colored={
                  order.percentageOfChange
                    ? order.percentageOfChange.toString()
                    : '0'
                }
                color="#9ca2aa"
                width={'25%'}
              />

              <AnimatedCell
                value={order.size}
                color="#9ca2aa"
                animation={'fadeInGreenAndBack'}
                width={'35%'}
              />
              <AnimatedCell
                value={order.price}
                animation={'fadeInGreen'}
                color="#34cb86d1"
                width={'30%'}
              />
            </Row>
          ))}
        </Body>
      </div>
    )
  }
}

class OrderBookTable extends PureComponent {
  render() {
    const {
      onButtonClick,
      roundTill,
      aggregation,
      quote,
      data,
      theme: { palette },
    } = this.props
    const {
      background,
      action,
      primary: { dark },
    } = palette
    console.log(this.props.data)

    return (
      <Table>
        <Title background={dark}>
          <Typography color="textSecondary" variant="headline" align="center">
            Order Book
          </Typography>
          <SwitchTablesButton
            onClick={onButtonClick}
            variant="outlined"
            color="primary"
          >
            HISTORY
          </SwitchTablesButton>
        </Title>
        <Head background={background.default}>
          <Row isHead background={background.default}>
            <HeadCell width={'50%'}>
              <Typography variant="title" color="default" align="left">
                Size
              </Typography>
            </HeadCell>
            <HeadCell width={'50%'}>
              <Typography variant="title" noWrap color="default" align="left">
                Price {quote || 'Fiat'}
              </Typography>
            </HeadCell>
          </Row>
        </Head>
        <Body height={'calc(100vh - 59px - 80px - 39px - 37px - 24px - 26px)'}>
          {data.map((order, i) => (
            <Row
              hoverBackground={action.hover}
              key={i}
              background={background.default}
            >
              <Cell width={'50%'}>
                <Typography color="default" noWrap variant="body1" align="left">
                  {order.size}
                </Typography>
              </Cell>
              <Cell width={'50%'}>
                <Typography color="default" noWrap variant="body1" align="left">
                  {order.price}
                </Typography>
              </Cell>
            </Row>
          ))}
        </Body>
      </Table>
    )
  }
}

const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max - width: 1080px) {
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

const EmptyCell = Cell.extend`
  position: relative;

  &: before {
    transition: all 0.5s linear;
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: ${(props: { colored?: string }) => Number(props.colored) / 4}%;
    height: 100 %;
    content: '';
    background-color: ${(props: { status?: string; colored?: string }) =>
      props.status === 'fall' ? '#d77455' : '#34cb86d1'};
  }
`

export default OrderBookTable
