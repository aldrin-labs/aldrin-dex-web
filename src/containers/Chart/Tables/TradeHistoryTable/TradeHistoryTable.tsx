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

export interface IProps {
  onButtonClick: Function
  base: string
  data: any[]
}

class TradeHistoryTable extends PureComponent<IProps> {
  state = {
    tableExpanded: true,
  }

  render() {
    const { base, data } = this.props
    const { tableExpanded } = this.state

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
                Price<br /> ({base || 'Fiat'})
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
            {data.slice(0, 30).map((order, i) => (
              <Row key={i} background={'#25282c'}>
                <AnimatedCell
                  animation={
                    order.status === 'fall'
                      ? 'fadeInRedAndBack'
                      : 'fadeInGreenAndBack'
                  }
                  color="#9ca2aa"
                  width={'33%'}
                  value={order.size.toFixed(8)}
                />

                <AnimatedCell
                  animation={
                    order.status === 'fall' ? 'fadeInRed' : 'fadeInGreen'
                  }
                  color={order.status === 'fall' ? '#d77455' : '#34cb86d1'}
                  width={'33%'}
                  value={Number(order.price).toFixed(2)}
                >
                  <StyledArrow
                    direction={order.status === 'fall' ? 'down' : 'up'}
                  />
                </AnimatedCell>
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
  z-index: 999;
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

const TradeHistoryTableCollapsible = CollapsibleTable.extend`
  max-height: 80%;
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
