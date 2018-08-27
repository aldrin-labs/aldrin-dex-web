import React, { Component } from 'react'
import { red } from '@material-ui/core/colors'

import { Row, Body, Cell } from '@components/Table/Table'
import { TypographyFullWidth } from '@utils/cssUtils'
import { opacityAnimation } from '../../../../../../../styles/keyframes'
import { Loading } from '@components/Loading'
import { calculatePercentagesOfOrderSize } from '@utils/chartPageUtils'
import { EmptyCell } from '@containers/Chart/Tables/OrderBookTable/Tables/Asks/SharedStyles'
import { IProps } from './OrderBookBody.types'

class ClassBody extends Component<IProps> {
  componentDidMount() {
    //  scroll down to bottom of table
    const objDiv = document.getElementById('body')
    objDiv.scrollTop = objDiv.scrollHeight
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
      <Body id="body" height={'calc(100% - 44px - 32px)'}>
        {data.length === 0 ? (
          <Loading centerAligned={true} />
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
                    +order.size,
                    data
                  ).toString()}
                  width={'10%'}
                />
                <Cell width={'45%'}>
                  <StyledTypography
                    anime={i === index}
                    textColor={red[400]}
                    color="default"
                    noWrap={true}
                    variant="body1"
                    align="right"
                  >
                    {Number(order.size).toFixed(digitsAfterDecimalForAsksSize)}
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
              </Row>
            ))}
          </>
        )}
      </Body>
    )
  }
}

const StyledTypography = TypographyFullWidth.extend`
  && {
    color: ${(props: { textColor: string }) => props.textColor};
    font-variant-numeric: lining-nums tabular-nums;
    ${(props: { anime: boolean; textColor: string }) =>
      props.anime
        ? `animation: ${opacityAnimation} 300ms cubic-bezier(0.4, 0, 1, 1) 0s 1 normal none running;`
        : ''};
  }
`

export default ClassBody
