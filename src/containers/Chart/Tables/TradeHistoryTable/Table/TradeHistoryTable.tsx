import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import Collapse from '@material-ui/core/Collapse'
import MdArrowDropUp from '@material-ui/icons/ArrowDropUp'
import MdArrowUpward from '@material-ui/icons/ArrowUpward'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  HeadCell,
  Cell,
} from '@components/OldTable/Table'
import { IProps, IState, ITicker } from './TradeHistoryTable.types'
import { Loading } from '@components/Loading'
import { TypographyFullWidth } from '@styles/cssUtils'

class TradeHistoryTable extends PureComponent<IProps, IState> {
  state = {
    tableExpanded: true,
  }

  render() {
    const {
      numbersAfterDecimalForPrice,
      quote,
      data,
      theme: { palette },
    } = this.props
    const { tableExpanded } = this.state
    const { background, action, primary, type, red, green } = palette

    return (
      <TradeHistoryTableCollapsible tableExpanded={tableExpanded}>
        <CollapseWrapper in={tableExpanded} collapsedHeight="2.5rem">
          <TriggerTitle
            background={primary[type]}
            onClick={() => {
              this.setState((prevState) => ({
                tableExpanded: !prevState.tableExpanded,
              }))
            }}
          >
            <TypographyFullWidth
              textColor={palette.getContrastText(primary[type])}
              variant="subheading"
              align="center"
            >
              Trade history
            </TypographyFullWidth>

            <StyledArrowSign
              variant={{
                tableCollapsed: !tableExpanded,
                up: !tableExpanded,
              }}
              style={{
                marginRight: '0.5rem',
                color: palette.secondary['light'],
              }}
            />
          </TriggerTitle>
          <Head background={background.default}>
            <Row
              background={background.default}
              isHead={true}
              style={{ height: '100%' }}
            >
              <HeadCell color="#9ca2aa" width={'33%'}>
                <TypographyFullWidth
                  textColor={palette.getContrastText(background.default)}
                  variant="subheading"
                  align="right"
                  noWrap={true}
                >
                  Trade Size
                </TypographyFullWidth>
              </HeadCell>
              <HeadCell color="#9ca2aa" width={'36%'}>
                <TypographyFullWidth
                  noWrap={true}
                  textColor={palette.getContrastText(background.default)}
                  variant="subheading"
                  align="right"
                >
                  Price {quote || 'Fiat'}
                </TypographyFullWidth>
              </HeadCell>
              <HeadCell
                style={{ lineHeight: '32px' }}
                color="#9ca2aa"
                width={'30%'}
              >
                <TypographyFullWidth
                  variant="subheading"
                  textColor={palette.getContrastText(background.default)}
                  align="right"
                >
                  Time
                </TypographyFullWidth>
              </HeadCell>
            </Row>
          </Head>
          <Body background={background.default} height="42vh">
            {data.length === 0 && tableExpanded ? (
              <Loading centerAligned={true} />
            ) : (
              <>
                {data.map((ticker: ITicker, i: number) => (
                  <Row
                    hoverBackground={action.hover}
                    key={i}
                    background={background.default}
                    // style={{ height: '27px' }}
                  >
                    <Cell width={'33%'}>
                      <TypographyFullWidth
                        noWrap={true}
                        variant="body1"
                        align="right"
                      >
                        {Number(ticker.size).toFixed(4)}
                      </TypographyFullWidth>
                    </Cell>
                    <Cell width={'36%'} style={{ display: 'flex' }}>
                      <StyledTypography
                        textColor={ticker.fall ? red.main : green.main}
                        noWrap={true}
                        variant="body1"
                        align="right"
                      >
                        {Number(ticker.price).toFixed(
                          numbersAfterDecimalForPrice
                        )}
                      </StyledTypography>
                      <StyledArrow
                        color={ticker.fall ? red.main : green.main}
                        direction={ticker.fall ? 'down' : 'up'}
                      />
                    </Cell>
                    <Cell width={'31%'}>
                      <TypographyFullWidth
                        color="primary"
                        noWrap={true}
                        variant="body1"
                        align="right"
                      >
                        {ticker.time}
                      </TypographyFullWidth>
                    </Cell>
                  </Row>
                ))}
              </>
            )}
          </Body>
        </CollapseWrapper>
      </TradeHistoryTableCollapsible>
    )
  }
}

const StyledTypography = styled(TypographyFullWidth)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
  }
`

const TriggerTitle = styled(Title)`
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
  transition: opacity 0.75s ease-in-out;

  &:hover {
    opacity: 0.85;
  }
`

const CollapseWrapper = styled(Collapse)`
  width: 100%;
`

const CollapsibleTable = styled(Table)`
  position: absolute;
  bottom: 0;
  max-height: calc(70% - 37px);
  z-index: 10;
  width: 100%;

  @-moz-document url-prefix() {
    bottom: 22.5px;
  }
`

const TradeHistoryTableCollapsible = styled(CollapsibleTable)`
  max-height: 65%;

  @media (max-width: 1080px) {
    bottom: 0.5rem;
  }
`

const StyledArrowSign = styled(MdArrowDropUp)`
  font-size: 2rem;
  transform: ${(props) =>
    props.variant.up ? 'rotate(0deg)' : 'rotate(180deg)'};

  position: absolute;
  left: 0.25rem;

  bottom: 15%;
  transition: all 0.5s ease;

  ${TriggerTitle}:hover & {
    animation: ${(props) =>
        props.variant.tableCollapsed ? JumpUpArrow : JumpDownArrow}
      0.5s linear 0.5s 2;
  }
`

const JumpDownArrow = keyframes`
0% {
  bottom: 15%;
}
50% {
  bottom: -10%;
}
100% {
  bottom: 15%;

}
`
const JumpUpArrow = keyframes`
0% {
  bottom: 15%;
}
50% {
  bottom: 50%;
}
100% {
  bottom: 15%;
}
`

const StyledArrow = styled(MdArrowUpward)`
  min-width: 20%;
  color: ${(props: { direction: string; color: string }) => props.color};

  position: absolute;
  left: 0.25rem;
  top: calc(50% - 8px);
  transform: ${(props: { direction: string; color: string }) =>
    props.direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)'};
`

export default TradeHistoryTable
