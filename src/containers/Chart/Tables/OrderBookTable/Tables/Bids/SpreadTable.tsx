import React, { Component } from 'react'
import { green } from '@material-ui/core/colors'
import { difference } from 'lodash'

import { calculatePercentagesOfOrderSize } from '@utils/chartPageUtils'
import { Table, Row, Body, Head, Cell, HeadCell } from '@components/Table/Table'
import { Loading } from '@components/Loading'
import { TypographyFullWidth } from '@utils/cssUtils'
import { hexToRgbAWithOpacity } from '@styles/helpers'
import {
  EmptyCell,
  StyledTypography,
  RowWithVolumeChart,
} from '@containers/Chart/Tables/SharedStyles'

let index: number | null = null
//  index for animations, no need to keep it in state couse it realted to css
//  and there is no needs for rerendering
class SpreadTable extends Component {
  shouldComponentUpdate(nextProps, nextState) {
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
      digitsAfterDecimalForSpread,
      roundTill,
      aggregation,
      spread,
      theme: { palette },
      quote,
      data,
      digitsAfterDecimalForBidsSize,
      digitsAfterDecimalForBidsPrice,
    } = this.props
    const {
      background,
      action,
      primary: { dark },
    } = palette

    return (
      <SpreadreadTableWrapper>
        <Head background={dark} style={{ height: '1.625rem' }}>
          <TriggerRow isHead={true} background={dark}>
            <EmptyCell width="10%" />
            <HeadCell width={'45%'}>
              <TypographyFullWidth
                textColor={palette.getContrastText(dark)}
                variant="body2"
                align="right"
              >
                {quote || 'Fiat'} spread{' '}
              </TypographyFullWidth>
            </HeadCell>
            <HeadCell width={'45%'}>
              <TypographyFullWidth
                textColor={palette.getContrastText(dark)}
                variant="body2"
                align="right"
                color="secondary"
              >
                {spread.toFixed(digitsAfterDecimalForSpread) <= 0
                  ? '~ 0'
                  : spread.toFixed(digitsAfterDecimalForSpread)}
              </TypographyFullWidth>
            </HeadCell>
          </TriggerRow>
        </Head>
        <Body
          style={{ background: background.default }}
          height="calc(100% - 26px)"
        >
          {data.length === 0 ? (
            <Loading centerAligned={true} />
          ) : (
            <>
              {data.map((order: { size: number; price: number }, i: number) => (
                <Row background={'transparent'} key={order.price}>
                  <RowWithVolumeChart
                    volumeColor={hexToRgbAWithOpacity(green[500], 0.25)}
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
                        textColor={green[500]}
                        anime={i === index}
                        color="default"
                        noWrap={true}
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
                        noWrap={true}
                        variant="body1"
                        align="right"
                      >
                        {Number(order.price).toFixed(
                          digitsAfterDecimalForBidsPrice
                        )}
                      </StyledTypography>
                    </Cell>
                  </RowWithVolumeChart>
                </Row>
              ))}
            </>
          )}
        </Body>
      </SpreadreadTableWrapper>
    )
  }
}

const TriggerRow = Row.extend`
  display: flex;
`

const SpreadreadTableWrapper = Table.extend`
  height: 50%;
  @media (max-width: 1080px) {
    bottom: 40px;
  }
`

export default SpreadTable
