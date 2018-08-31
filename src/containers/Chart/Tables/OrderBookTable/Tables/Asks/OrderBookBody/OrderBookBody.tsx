import React, { Component } from 'react'
import { red } from '@material-ui/core/colors'

import { Row, Cell } from '@components/Table/Table'
import { Loading } from '@components/Loading'
import {
  calculatePercentagesOfOrderSize,
  ScrollToBottom,
} from '@utils/chartPageUtils'
import { IProps } from './OrderBookBody.types'
import {
  EmptyCell,
  RowWithVolumeChart,
  StyledTypography,
  NotScrollableBody,
} from '@containers/Chart/Tables/SharedStyles'
import { hexToRgbAWithOpacity } from '@styles/helpers'

class ClassBody extends Component<IProps> {
  componentDidMount() {
    ScrollToBottom()
  }
  componentDidUpdate() {
    ScrollToBottom()
  }
  render() {
    const {
      data,
      digitsAfterDecimalForAsksPrice,
      digitsAfterDecimalForAsksSize,
      action,
      index,
      background,
    } = this.props

    return (
      <NotScrollableBody id="body" height={'calc(100% - 44px - 32px)'}>
        {data.length === 0 ? (
          <Loading centerAligned={true} />
        ) : (
          <>
            {data.map(
              (
                order: { size: number | string; price: number | string },
                i: number
              ) => (
                <Row background={'transparent'} key={order.price}>
                  <RowWithVolumeChart
                    volumeColor={hexToRgbAWithOpacity(red[500], 0.25)}
                    colored={calculatePercentagesOfOrderSize(
                      +order.size,
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
              )
            )}
          </>
        )}
      </NotScrollableBody>
    )
  }
}

export default ClassBody
