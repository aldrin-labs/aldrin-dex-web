import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { MdArrowDropUp } from 'react-icons/lib/md/'
import { Collapse, Typography } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { difference } from 'lodash'

import { calculatePercentagesOfOrderSize } from '@utils/chartPageUtils'
import { Table, Row, Body, Head, Cell, HeadCell } from '@components/Table/Table'
import { Loading } from '@components/Loading'
import { fromLightGreenToDeffaultGreen } from '../../../../../styles/keyframes'
import { TypographyFullWidth } from '@utils/cssUtils'

class SpreadTable extends Component {
  state = {
    tableExpanded: true,
    index: null,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate =
      difference(nextProps.data, this.props.data).length > 0 ||
      nextProps.activeExchange.index !== this.props.activeExchange.index ||
      nextProps.currencyPair !== this.props.currencyPair ||
      (this.props.data.length > 0 && nextProps.data.length === 0) ||
      nextState.tableExpanded !== this.state.tableExpanded

    return shouldUpdate
  }

  componentDidUpdate(prevProps) {
    const index =
      this.props.data &&
      this.props.data.findIndex(
        (el) => el === difference(this.props.data, prevProps.data)[0]
      )

    this.setState({ index })
  }

  onHeadClick = () => {
    this.setState((prevState) => ({
      tableExpanded: !prevState.tableExpanded,
    }))
  }

  render() {
    const { tableExpanded } = this.state
    const {
      roundTill,
      aggregation,
      spread,
      theme: { palette },
      quote,
      data,
      digitsAfterDecimalForBidsSize,
      digitsAfterDecimalForBidsPrice,
    } = this.props
    const { index } = this.state
    const {
      background,
      action,
      primary: { dark },
    } = palette

    return (
      <SpreadreadTableWrapper>
        <CollapseWrapper in={tableExpanded} collapsedHeight="1.5rem">
          <Head
            onClick={this.onHeadClick}
            background={dark}
            style={{ cursor: 'pointer', height: '1.625rem' }}
          >
            <TriggerRow isHead background={dark}>
              <HeadCell width={'10%'}>
                <StyledArrowSign
                  variant={{
                    tableExpanded: !tableExpanded,
                    up: !tableExpanded,
                  }}
                  style={{
                    color: palette.primary['contrastText'],
                  }}
                />
              </HeadCell>
              <HeadCell width={'45%'}>
                <TypographyFullWidth variant="body2" align="right">
                  {quote || 'Fiat'} spread{' '}
                </TypographyFullWidth>
              </HeadCell>
              <HeadCell width={'45%'}>
                <TypographyFullWidth variant="body2" align="right">
                  {spread.toFixed(2) || 0.01}
                </TypographyFullWidth>
              </HeadCell>
            </TriggerRow>
          </Head>
          <Body style={{ background: background.default }} height="40vh">
            {data.length === 0 && tableExpanded ? (
              <Loading centerAligned={true} />
            ) : (
              <>
                {data.map(
                  (order: { size: number; price: number }, i: number) => (
                    <Row
                      key={i}
                      hoverBackground={action.hover}
                      background={background.default}
                    >
                      <EmptyCell
                        colored={calculatePercentagesOfOrderSize(
                          order.size,
                          data
                        ).toString()}
                        width={'10%'}
                      />

                      <Cell width={'45%'}>
                        <StyledTypography
                          textColor={green[500]}
                          anime={i === index}
                          color="default"
                          noWrap
                          variant="body1"
                          align="right"
                        >
                          {Number(order.size).toFixed(
                            digitsAfterDecimalForBidsSize
                          )}
                        </StyledTypography>
                      </Cell>
                      <Cell width={'45%'}>
                        <StyledTypography
                          textColor={green[500]}
                          anime={i === index}
                          color="default"
                          noWrap
                          variant="body1"
                          align="right"
                        >
                          {Number(order.price).toFixed(
                            digitsAfterDecimalForBidsPrice
                          )}
                        </StyledTypography>
                      </Cell>
                    </Row>
                  )
                )}
              </>
            )}
          </Body>
        </CollapseWrapper>
      </SpreadreadTableWrapper>
    )
  }
}

const StyledTypography = TypographyFullWidth.extend`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
    ${(props: { anime: boolean }) =>
      props.anime
        ? `animation: ${fromLightGreenToDeffaultGreen} 300ms cubic-bezier(0.4, 0, 1, 1) 0s 1 normal none running;`
        : ''};
  }
`

const EmptyCell = Cell.extend`
  position: relative;

  &:before {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: ${(props: { colored?: string }) => Number(props.colored)}%;
    height: 100%;
    content: '';
    background-color: ${green[500]};
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
