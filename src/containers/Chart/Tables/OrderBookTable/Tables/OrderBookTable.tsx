import React, { Component } from 'react'
import styled from 'styled-components'
import { Button, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { difference } from 'lodash'

import { TypographyFullWidth } from '@utils/cssUtils'
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
import {
  StyledTypography,
  EmptyCell,
  RowWithVolumeChart,
} from '@containers/Chart/Tables/SharedStyles'
import { hexToRgbAWithOpacity } from '../../../../../styles/helpers'

let index: number | null = null
class OrderBookTable extends Component {
  state = {
    index: null,
  }

  shouldComponentUpdate(nextProps) {
    const shouldUpdate =
      difference(nextProps.data, this.props.data).length > 0 ||
      nextProps.activeExchange.index !== this.props.activeExchange.index ||
      nextProps.currencyPair !== this.props.currencyPair ||
      (this.props.data.length > 0 && nextProps.data.length === 0)

    return shouldUpdate
  }

  componentDidUpdate(prevProps) {
    index =
      this.props.data &&
      this.props.data.findIndex(
        (el) => el === difference(this.props.data, prevProps.data)[0]
      )
  }

  render() {
    const {
      onButtonClick,
      roundTill,
      aggregation,
      digitsAfterDecimalForAsksSize,
      digitsAfterDecimalForAsksPrice,
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
          <Typography color="default" variant="subheading" align="center">
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
          <Row isHead={true} background={background.default}>
            <EmptyCell width={'10%'} />
            <HeadCell width={'45%'}>
              <TypographyFullWidth
                variant="subheading"
                color="default"
                align="right"
              >
                Trade Size
              </TypographyFullWidth>
            </HeadCell>
            <HeadCell width={'45%'}>
              <TypographyFullWidth
                variant="subheading"
                noWrap={true}
                color="default"
                align="right"
              >
                Price {quote || 'Fiat'}
              </TypographyFullWidth>
            </HeadCell>
          </Row>
        </Head>
        <Body height={'calc(99vh - 59px - 80px - 39px - 37px - 24px - 26px)'}>
          {data.length === 0 ? (
            <Loading centerAligned={true} />
          ) : (
            <>
              {data.map((order, i) => (
                <Row background={'transparent'} key={order.price}>
                  <RowWithVolumeChart
                    volumeColor={hexToRgbAWithOpacity(red[400], 0.25)}
                    colored={calculatePercentagesOfOrderSize(
                      order.size,
                      data
                    ).toString()}
                    hoverBackground={action.hover}
                    background={background.default}
                  >
                    <EmptyCell width={'10%'} />
                    <Cell width={'45%'}>
                      <StyledTypography
                        anime={i === index}
                        textColor={red[400]}
                        color="default"
                        noWrap={true}
                        variant="body1"
                        align="right"
                      >
                        {Number(order.size).toFixed(
                          digitsAfterDecimalForAsksSize
                        )}
                      </StyledTypography>
                    </Cell>
                    <Cell width={'45%'}>
                      <StyledTypography
                        anime={i === index}
                        textColor={red[400]}
                        color="default"
                        noWrap={true}
                        variant="body1"
                        align="right"
                      >
                        {Number(order.price).toFixed(
                          digitsAfterDecimalForAsksPrice
                        )}
                      </StyledTypography>
                    </Cell>
                  </RowWithVolumeChart>
                </Row>
              ))}
            </>
          )}
        </Body>
      </Table>
    )
  }
}

const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max - width: 1080px) {
      display: block;
    }
  }
`

export default OrderBookTable
