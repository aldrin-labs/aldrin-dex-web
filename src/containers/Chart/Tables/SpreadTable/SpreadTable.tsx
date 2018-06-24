import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { MdArrowDropUp } from 'react-icons/lib/md/'
import { Collapse } from '@material-ui/core'

import {
  Table,
  Row,
  Body,
  Head,
  Cell as RowCell,
  HeadCell,
} from '@components/Table/Table'
import { demoAnime } from '../utils'

class SpreadTable extends PureComponent {
  state = {
    tableExpanded: true,
    data: [],
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
    })
  }

  onHeadClick = () => {
    this.setState((prevState) => ({
      tableExpanded: !prevState.tableExpanded,
    }))
  }

  demoAnimation = (sizeInd: number) => {
    this.setState({ data: demoAnime(sizeInd, this.state.data) })
  }

  render() {
    const { tableExpanded, data } = this.state
    const { roundTill, aggregation, spread, base } = this.props

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
                  tableExpanded={!tableExpanded}
                  up={!tableExpanded}
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
          <Body height="300px">
            {data.slice(0, 30).map((order, i) => (
              <Row
                onClick={() => {
                  this.demoAnimation(order.size)
                }}
                key={i}
                background={'#25282c'}
              >
                <EmptyCell
                  status={'fall'}
                  colored={order.percentageOfChange.toString()}
                  color="#9ca2aa"
                  width={'25%'}
                />
                <Cell
                  animated={order.updated ? 'red' : 'none'}
                  color="#9ca2aa"
                  width={'35%'}
                >
                  {Number(order.size).toFixed(8)}
                </Cell>
                <Cell color="#d77455" width={'30%'}>
                  {roundTill(
                    aggregation,
                    Number(order.price).toFixed(2)
                  ).toFixed(2)}
                </Cell>
              </Row>
            ))}
          </Body>
        </CollapseWrapper>
      </SpreadreadTableWrapper>
    )
  }
}

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

const TriggerRow = Row.extend`
  display: flex;
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const CollapsibleTable = Table.extend`
  max-height: calc(50% - 37px);
  position: absolute;
  bottom: 23px;
  left: 0;
  z-index: 999;
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

const StyledArrowSign = styled(MdArrowDropUp)`
  font-size: 1rem;
  transform: ${(props: { up: boolean }) =>
    props.up ? 'rotate(0deg)' : 'rotate(180deg)'};
  position: relative;
  transition: all 0.5s ease;

  ${TriggerRow}:hover & {
    animation: ${(props: { tableExpanded: boolean }) =>
        props.tableExpanded ? JumpUpArrow : JumpDownArrow}
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
