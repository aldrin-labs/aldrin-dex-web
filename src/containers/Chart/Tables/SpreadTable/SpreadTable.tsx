import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { MdArrowDropUp } from 'react-icons/lib/md/'
import { Collapse } from '@material-ui/core'

import { Table, Row, Body, Head, Cell, HeadCell } from '@components/Table/Table'
import AnimatedCell from '@components/Table/AnimatedCell/AnimatedCell'

class SpreadTable extends PureComponent {
  state = {
    tableExpanded: true,
    data: [],
  }

  onHeadClick = () => {
    this.setState((prevState) => ({
      tableExpanded: !prevState.tableExpanded,
    }))
  }

  render() {
    const { tableExpanded } = this.state
    const { roundTill, aggregation, spread, base, data } = this.props

    return (
      <SpreadreadTableWrapper>
        <CollapseWrapper in={tableExpanded} collapsedHeight="1.5rem">
          <Head
            onClick={this.onHeadClick}
            background={'#292d31'}
            style={{ cursor: 'pointer', height: '1.625rem' }}
          >
            <TriggerRow isHead background={'#292d31'}>
              <HeadCell color="#9ca2aa" width={'20%'}>
                <StyledArrowSign
                  variant={{
                    tableExpanded: !tableExpanded,
                    up: !tableExpanded,
                  }}
                />
              </HeadCell>
              <HeadCell
                style={{
                  position: 'relative',
                  left: '5%',
                }}
                color="#9ca2aa"
                width={'35%'}
              >
                {base || 'Fiat'} spread{' '}
              </HeadCell>
              <HeadCell
                style={{
                  position: 'relative',
                  left: '13%',
                }}
                color="#9ca2aa"
                width={'14%'}
              >
                {spread || 0.01}
              </HeadCell>
            </TriggerRow>
          </Head>
          <Body height="254px">
            {data.map((order, i) => (
              <Row key={i} background={'#25282c'}>
                <EmptyCell
                  status={'fall'}
                  colored={order.percentageOfChange.toString()}
                  color="#9ca2aa"
                  width={'25%'}
                />
                <AnimatedCell
                  animation={'fadeInRedAndBack'}
                  color="#9ca2aa"
                  width={'35%'}
                  value={Number(order.size).toFixed(8)}
                />

                <AnimatedCell
                  value={roundTill(
                    aggregation,
                    Number(order.price).toFixed(2)
                  ).toFixed(2)}
                  animation={'fadeInRed'}
                  color="#d77455"
                  width={'30%'}
                />
              </Row>
            ))}
          </Body>
        </CollapseWrapper>
      </SpreadreadTableWrapper>
    )
  }
}

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
    transition: all 0.5s linear;
  }
`

const TriggerRow = Row.extend`
  display: flex;
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const CollapsibleTable = Table.extend`
  max-height: 50%;
  position: absolute;
  bottom: 23px;
  left: 0;
  z-index: 100;
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

const StyledArrowSign = styled(MdArrowDropUp)`
  font-size: 1rem;
  transform: ${(props) =>
    props.variant.up ? 'rotate(0deg)' : 'rotate(180deg)'};
  position: relative;
  transition: all 0.5s ease;

  ${TriggerRow}:hover & {
    animation: ${(props: { tableExpanded: boolean; up: boolean }) =>
        props.variant.tableExpanded ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }
`

const SpreadreadTableWrapper = CollapsibleTable.extend`
  @media (max-width: 1080px) {
    bottom: 40px;
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

export default SpreadTable
