import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Button, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  Cell,
  HeadCell,
} from '@components/Table/Table'
import { Loading } from '@components/Loading'
import { calculatePercentagesOfOrderSize } from '@utils/chartPageUtils'

class OrderBookTable extends PureComponent {
  render() {
    const {
      onButtonClick,
      roundTill,
      aggregation,
      quote,
      data,
      theme: { palette },
    } = this.props
    const {
      background,
      action,
      primary: { dark },
    } = palette

    return (
      <Table>
        <Title background={dark}>
          <Typography color="default" variant="headline" align="center">
            Order Book
          </Typography>
          <SwitchTablesButton
            onClick={onButtonClick}
            variant="outlined"
            color="primary"
          >
            HISTORY
          </SwitchTablesButton>
        </Title>
        <Head background={background.default}>
          <Row isHead background={background.default}>
            <EmptyCell width={'10%'} />
            <HeadCell width={'45%'}>
              <Typography variant="title" color="default" align="left">
                Size
              </Typography>
            </HeadCell>
            <HeadCell width={'45%'}>
              <Typography variant="title" noWrap color="default" align="left">
                Price {quote || 'Fiat'}
              </Typography>
            </HeadCell>
          </Row>
        </Head>
        <Body height={'calc(98vh - 59px - 80px - 39px - 37px - 24px - 26px)'}>
          {data.length === 0 ? (
            <Loading centerAligned />
          ) : (
            <>
              {data.map((order, i) => (
                <Row
                  hoverBackground={action.hover}
                  key={i}
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
                      textColor={red[400]}
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
                      textColor={red[400]}
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
      </Table>
    )
  }
}

const StyledTypography = styled(Typography)`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
  }
`

const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max - width: 1080px) {
      display: block;
    }
  }
`

const EmptyCell = Cell.extend`
  position: relative;

  &: before {
    transition: all 0.5s linear;
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: ${(props: { colored?: string }) => Number(props.colored)}%;
    height: 100%;
    content: '';
    background-color: ${red[400]};
  }
`

export default OrderBookTable
