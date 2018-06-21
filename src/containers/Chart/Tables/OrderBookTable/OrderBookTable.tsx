import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from '@material-ui/core'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell as RowCell,
  HeadCell,
} from '@components/Table/Table'

class OrderBookTable extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
    })
  }

  demoAnime = (sizeInd: number) => {
    const setFalseForSecond = (ind: number) => {
      setTimeout(() => {
        this.setState({
          data: this.state.data.map(
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
      data: this.state.data.map(
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

  render() {
    const { onButtonClick, roundTill, aggregation } = this.props

    const { data } = this.state

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
              Market Size
            </HeadCell>
            <HeadCell
              color="#9ca2aa"
              style={{
                position: 'relative',
                left: '13%',
              }}
              width={'14%'}
            >
              Price<br />(USD)
            </HeadCell>
          </Row>
        </Head>
        <Body height={'calc(100vh - 59px - 80px - 39px - 37px - 24px)'}>
          {data.map((order, i) => (
            <Row
              onClick={() => {
                this.demoAnime(order.size)
              }}
              key={i}
              background={'#292d31'}
            >
              <EmptyCell
                status={'rise'}
                colored={order.percentageOfChange.toString()}
                color="#9ca2aa"
                width={'25%'}
              />

              <Cell
                color="#9ca2aa"
                animated={order.updated ? 'green' : 'none'}
                width={'35%'}
              >
                {Number(order.size).toFixed(8)}
              </Cell>
              <Cell color="#34cb86d1" width={'30%'}>
                {roundTill(aggregation, Number(order.price).toFixed(2)).toFixed(
                  2
                )}
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

    @media (max-width: 1080px) {
      display: block;
    }
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

export default OrderBookTable
