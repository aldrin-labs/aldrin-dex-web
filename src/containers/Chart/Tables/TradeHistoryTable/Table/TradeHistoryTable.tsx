import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { Collapse, Typography } from '@material-ui/core'
import { MdArrowUpward, MdArrowDropUp } from 'react-icons/lib/md'
import { red, green } from '@material-ui/core/colors'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  HeadCell,
  Cell,
} from '@components/Table/Table'
import { IProps, ITicker } from './TradeHistoryTable.types'

class TradeHistoryTable extends PureComponent<IProps> {
  state = {
    tableExpanded: true,
  }

  componentDidMount() {
    this.props.subscribeToMore && this.props.subscribeToMore()
  }

  render() {
    const {
      quote,
      data,
      theme: { palette },
    } = this.props
    const { tableExpanded } = this.state
    const {
      background,
      action,
      primary: { dark },
    } = palette

    return (
      <TradeHistoryTableCollapsible tableExpanded={tableExpanded}>
        <CollapseWrapper in={tableExpanded} collapsedHeight="2.5rem">
          <TriggerTitle
            background={dark}
            onClick={() => {
              this.setState((prevState) => ({
                tableExpanded: !prevState.tableExpanded,
              }))
            }}
          >
            <Typography color="textSecondary" variant="headline" align="center">
              Trade history
            </Typography>

            <StyledArrowSign
              variant={{
                tableCollapsed: !tableExpanded,
                up: !tableExpanded,
              }}
              style={{ marginRight: '0.5rem' }}
            />
          </TriggerTitle>
          <Head background={background.default}>
            <Row
              background={background.default}
              isHead
              style={{ height: '100%' }}
            >
              <HeadCell color="#9ca2aa" width={'33%'}>
                <Typography variant="subheading" color="default" align="left">
                  Size
                </Typography>
              </HeadCell>
              <HeadCell color="#9ca2aa" width={'36%'}>
                <Typography variant="subheading" color="default" align="left">
                  Price {quote || 'Fiat'}
                </Typography>
              </HeadCell>
              <HeadCell
                style={{ lineHeight: '32px' }}
                color="#9ca2aa"
                width={'30%'}
              >
                <Typography variant="subheading" color="default" align="left">
                  Time
                </Typography>
              </HeadCell>
            </Row>
          </Head>
          <Body style={{ background: background.default }} height="400px">
            {data.map((ticker: ITicker, i: number) => {
              let color: string = ticker.fall ? red[400] : green[500]
              setTimeout(() => {
                color = '#000'
              }, 100)

              return (
                <Row
                  hoverBackground={action.hover}
                  key={i}
                  background={background.default}
                  style={{ height: '27px' }}
                >
                  <Cell width={'33%'}>
                    <StyledTypography
                      textColor={color}
                      noWrap
                      variant="body1"
                      align="left"
                    >
                      {ticker.size}
                    </StyledTypography>
                  </Cell>
                  <Cell width={'36%'} style={{ display: 'flex' }}>
                    <StyledTypography
                      textColor={color}
                      noWrap
                      variant="body1"
                      align="left"
                    >
                      {ticker.price}
                    </StyledTypography>
                    <StyledArrow
                      color={color}
                      direction={ticker.fall ? 'down' : 'up'}
                    />
                  </Cell>
                  <Cell width={'31%'}>
                    <StyledTypography
                      textColor={color}
                      noWrap
                      variant="body1"
                      align="left"
                    >
                      {ticker.time}
                    </StyledTypography>
                  </Cell>
                </Row>
              )
            })}
          </Body>
        </CollapseWrapper>
      </TradeHistoryTableCollapsible>
    )
  }
}

const StyledTypography = styled(Typography)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
  }
`

const TriggerTitle = Title.extend`
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
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

  position: absolute;
  left: 0.25rem;
  color: white;
  bottom: 30%;
  transition: all 0.5s ease;

  ${TriggerTitle}:hover & {
    animation: ${(props) =>
        props.variant.tableCollapsed ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }
`

const JumpDownArrow = keyframes`
0% {
  bottom: 30%;
}
50% {
  bottom: 10%;
}
100% {
  bottom: 30%;

}
`
const JumpUpArrow = keyframes`
0% {
  bottom: 30%;
}
50% {
  bottom: 50%;
}
100% {
  bottom: 30%;
}
`

const StyledArrow = styled(MdArrowUpward)`
  min-width: 20%;
  color: ${(props: { direction: string; color: string }) => props.color};

  position: absolute;
  right: 0;
  top: calc(50% - 8px);
  transform: ${(props: { direction: string; color: string }) =>
    props.direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)'};
`

export default TradeHistoryTable
