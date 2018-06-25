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
  HeadCell,
} from '@components/Table/Table'
import AnimatedCell from '@components/Table/AnimatedCell/AnimatedCell'

export interface IProps {
  onButtonClick: Function
  base: string
  data: any[]
}

class TradeHistoryTable extends PureComponent<IProps> {
  render() {
    const { onButtonClick, base, data } = this.props

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
            <Row key={i} background={'#292d31'}>
              <AnimatedCell
                animation={
                  order.status === 'fall'
                    ? 'fadeInRedAndBack'
                    : 'fadeInGreenAndBack'
                }
                color="#9ca2aa"
                width={'33%'}
                value={order.tradeSize.toFixed(5)}
              />

              <CellWithArrow
                animation={
                  order.status === 'fall' ? 'fadeInRed' : 'fadeInGreen'
                }
                color={order.status === 'fall' ? '#d77455' : '#34cb86d1'}
                width={'33%'}
                value={Number(order.size).toFixed(8)}
              >
                <StyledArrow
                  direction={order.status === 'fall' ? 'down' : 'up'}
                />
              </CellWithArrow>
              <AnimatedCell
                animation={
                  order.status === 'fall'
                    ? 'fadeInRedAndBack'
                    : 'fadeInGreenAndBack'
                }
                color="#9ca2aa"
                width={'33%'}
                value={order.time}
              />
            </Row>
          ))}
        </Body>
      </Table>
    )
  }
}

const CellWithArrow = styled(AnimatedCell)`
  position: relative;
`

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

export default TradeHistoryTable
