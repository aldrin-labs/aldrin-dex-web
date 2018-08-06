import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { MdArrowDropUp } from 'react-icons/lib/md/'
import { Collapse, Typography } from '@material-ui/core'
import { green } from '@material-ui/core/colors'

import { Table, Row, Body, Head, Cell, HeadCell } from '@components/Table/Table'
import { Loading } from '@components/Loading'

class SpreadTable extends PureComponent {
  state = {
    tableExpanded: true,
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
    } = this.props
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
                <Typography variant="body2" align="left">
                  {quote || 'Fiat'} spread{' '}
                </Typography>
              </HeadCell>
              <HeadCell width={'45%'}>
                <Typography variant="body2" align="left">
                  {spread || 0.01}
                </Typography>
              </HeadCell>
            </TriggerRow>
          </Head>
          <Body style={{ background: background.default }} height="254px">
            {data.length === 0 && tableExpanded ? (
              <Loading centerAligned />
            ) : (
              <>
                {data.map((order, i) => (
                  <Row
                    key={i}
                    hoverBackground={action.hover}
                    background={background.default}
                  >
                    <EmptyCell status={'fall'} colored={'15'} width={'10%'} />

                    <Cell width={'45%'}>
                      <StyledTypography
                        textColor={green[500]}
                        color="default"
                        noWrap
                        variant="body1"
                        align="left"
                      >
                        {order.size}
                      </StyledTypography>
                    </Cell>
                    <Cell width={'45%'}>
                      <StyledTypography
                        textColor={green[500]}
                        color="default"
                        noWrap
                        variant="body1"
                        align="left"
                      >
                        {order.price}
                      </StyledTypography>
                    </Cell>
                  </Row>
                ))}
              </>
            )}
          </Body>
        </CollapseWrapper>
      </SpreadreadTableWrapper>
    )
  }
}
const StyledTypography = styled(Typography)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
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
