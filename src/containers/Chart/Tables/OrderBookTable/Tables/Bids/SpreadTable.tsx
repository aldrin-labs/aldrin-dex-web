import React, { Component } from 'react'
import styled from 'styled-components'
import { difference } from 'lodash-es'

import { calculatePercentagesOfOrderSize } from '@utils/chartPageUtils'
import {
  Table,
  Row,
  Head,
  Cell,
  HeadCell,
  Body,
} from '@components/OldTable/Table'
import { Loading } from '@components/Loading'
import { TypographyFullWidth } from '@styles/cssUtils'
import { hexToRgbAWithOpacity } from '@styles/helpers'
import {
  EmptyCell,
  StyledTypography,
  RowWithVolumeChart,
} from '@containers/Chart/Tables/SharedStyles'
import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@hoc/'

let index: number | null = null
//  index for animations, no need to keep it in state couse it realted to css
//  and there is no needs for rerendering
class SpreadTable extends Component<IProps> {
  shouldComponentUpdate(nextProps: IProps) {
    const shouldUpdate =
      difference(nextProps.data, this.props.data).length > 0 ||
      nextProps.currencyPair !== this.props.currencyPair ||
      (this.props.data.length > 0 && nextProps.data.length === 0)

    return shouldUpdate
  }

  componentDidUpdate(prevProps: IProps) {
    index =
      this.props.data &&
      this.props.data.findIndex(
        (el) => el === difference(this.props.data, prevProps.data)[0]
      )
  }

  render() {
    const {
      digitsAfterDecimalForSpread,
      spread,
      theme: { palette },
      quote,
      data,
      digitsAfterDecimalForBidsSize,
      digitsAfterDecimalForBidsPrice,
    } = this.props
    const { background, action, primary, type, green } = palette

    return (
      <SpreadreadTableWrapper>
        <Head background={primary[type]} style={{ height: '1.625rem' }}>
          <TriggerRow isHead={true} background={primary[type]}>
            <EmptyCell width="10%" />
            <HeadCell width={'45%'}>
              <TypographyFullWidth
                textColor={palette.getContrastText(primary[type])}
                variant="body1"
                align="right"
              >
                {quote || 'Fiat'} spread{' '}
              </TypographyFullWidth>
            </HeadCell>
            <HeadCell width={'45%'}>
              <TypographyFullWidth
                textColor={palette.getContrastText(primary[type])}
                variant="body1"
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
        <Body background={background.default} height="calc(100% - 26px)">
          {data.length === 0 ? (
            <Loading centerAligned={true} />
          ) : (
            <>
              {data.map((order: { size: number; price: number }, i: number) => (
                <Row background={'transparent'} key={order.price}>
                  <RowWithVolumeChart
                    volumeColor={hexToRgbAWithOpacity(green.main, 0.25)}
                    colored={calculatePercentagesOfOrderSize(
                      order.size,
                      data
                    ).toString()}
                    hoverBackground={action.hover}
                    background={background.default}
                  >
                    <EmptyCell width={'10%'} />

                    <Cell pose={false} width={'45%'}>
                      <StyledTypography
                        textColor={green.main}
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
                    <Cell pose={false} width={'45%'}>
                      <StyledTypography
                        textColor={green.main}
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

const TriggerRow = styled(Row)`
  display: flex;
`

const SpreadreadTableWrapper = styled(Table)`
  height: 50%;
  @media (max-width: 1080px) {
    bottom: 40px;
  }
`

export default withErrorFallback(SpreadTable)
