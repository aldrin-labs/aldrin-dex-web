import React, { Component } from 'react'

import { Row, Cell, Body } from '@components/OldTable/Table'
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
} from '@containers/Chart/Tables/SharedStyles'
import { hexToRgbAWithOpacity } from '@styles/helpers'

let objDiv: HTMLElement | null

class ClassBody extends Component<IProps> {
  componentDidMount() {
    objDiv = document.getElementById('body')
    ScrollToBottom(objDiv)
  }

  componentDidUpdate() {
    if (
      objDiv &&
      objDiv.scrollHeight - objDiv.scrollTop - objDiv.clientHeight < 45
    ) {
      ScrollToBottom(objDiv)
    }
  }
  render() {
    const {
      data,
      digitsAfterDecimalForAsksPrice,
      digitsAfterDecimalForAsksSize,
      action,
      index,
      background,
      theme: {
        palette: { red },
      },
    } = this.props

    return (
      <Body id="body" height={'calc(100% - 44px - 32px)'}>
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
                    volumeColor={hexToRgbAWithOpacity(red.main, 0.25)}
                    colored={calculatePercentagesOfOrderSize(
                      +order.size,
                      data
                    ).toString()}
                    hoverBackground={action.hover}
                    background={background.default}
                  >
                    <EmptyCell width={'10%'} />
                    <Cell pose={false} width={'45%'}>
                      <StyledTypography
                        textColor={red.main}
                        color="default"
                        noWrap={true}
                        variant="body2"
                        align="right"
                      >
                        {Number(order.size).toFixed(
                          digitsAfterDecimalForAsksSize
                        )}
                      </StyledTypography>
                    </Cell>
                    <Cell pose={false} width={'45%'}>
                      <StyledTypography
                        textColor={red.main}
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
      </Body>
    )
  }
}

export default ClassBody
