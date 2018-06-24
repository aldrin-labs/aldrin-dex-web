import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from '@material-ui/core'
import { MdArrowUpward } from 'react-icons/lib/md/'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell as RowCell,
  HeadCell,
} from '@components/Table/Table'
import { demoAnime } from '../utils'

class TradeHistoryTable extends PureComponent {
  state = {
    data: [],
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
    })
  }

  demoAnimation = (sizeInd: number) => {
    this.setState({ data: demoAnime(sizeInd, this.state.data) })
  }

  render() {
    const { onButtonClick, base } = this.props
    const { data } = this.state

    return (
      <Table>
        <Title>
          Trade history
          <SwitchTablesButton
            onClick={onButtonClick}
            variant="outlined"
            color="primary"
          >
            ORDER
          </SwitchTablesButton>
        </Title>
        <Head background={'#292d31'}>
          <Row background={'#292d31'} isHead style={{ height: '100%' }}>
            <HeadCell color="#9ca2aa" width={'33%'}>
              Trade <br /> size
            </HeadCell>
            <HeadCell color="#9ca2aa" width={'33%'}>
              Price<br /> ({base || 'Fiat'})
            </HeadCell>
            <HeadCell color="#9ca2aa" width={'33%'}>
              Time
            </HeadCell>
          </Row>
        </Head>
        <Body height="calc(100vh - 59px - 80px - 39px - 37px - 32px )">
          {data.slice(0, 30).map((order, i) => (
            <Row
              onClick={() => {
                this.demoAnimation(order.size)
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
              <CellWithArrow
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
                <div>{Number(order.size).toFixed(8)}</div>
                <StyledArrow
                  direction={order.status === 'fall' ? 'down' : 'up'}
                />
              </CellWithArrow>
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

const StyledArrow = styled(MdArrowUpward)`
  min-width: 20%;
  position: absolute;
  right: 0;
  top: calc(50% - 8px);
  transform: ${(props: { direction: string }) =>
    props.direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)'};
`

const Cell = styled(RowCell)`
  animation: ${(props: { animated?: string; width: string; color: string }) => {
    if (props.animated === 'none') {
      return ''
    }

    if (props.animated === 'green') {
      return `${fadeInGreenAndBack} 1.5s ease`
    }

    if (props.animated === 'red') {
      return `${fadeInRedAndBack} 1.5s ease`
    }

    return ''
  }};
`

const CellWithArrow = Cell.extend`
  position: relative;
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

const fadeInGreenAndBack = keyframes`
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
const fadeInRedAndBack = keyframes`
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
const fadeInGreen = keyframes`
0% {
  color: #34cb86d1; 
}
50% {
  color: #9ca2aa;
}
100% {
  color: #34cb86d1;
}

`
const fadeInRed = keyframes`
0% {
  color: #d77455;
}
50% {
  color: #9ca2aa;
}
100% {
  color: #d77455;
}

`

export default TradeHistoryTable
