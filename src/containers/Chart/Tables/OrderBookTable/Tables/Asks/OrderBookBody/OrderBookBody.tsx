import React, { Component } from 'react'
import { red } from '@material-ui/core/colors'

import { Row, Body, Cell } from '@components/Table/Table'
import { Loading } from '@components/Loading'
import { calculatePercentagesOfOrderSize } from '@utils/chartPageUtils'
import { IProps } from './OrderBookBody.types'
import {
  EmptyCell,
  RowWithVolumeChart,
  StyledTypography,
} from '@containers/Chart/Tables/SharedStyles'
import { hexToRgbAWithOpacity } from '../../../../../../../styles/helpers'

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
      tableExpanded,
      action,
      index,
      background,
    } = this.props

    return (
      <StyledBody
        id="body"
        tableExpanded={tableExpanded}
        height={
          tableExpanded
            ? 'calc(60vh - 59px - 80px - 39px - 37px - 24px - 26px)'
            : 'calc(99vh - 59px - 80px - 39px - 37px - 24px - 26px)'
        }
      >
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
      </StyledBody>
    )
  }
}

const StyledBody = Body.extend`
  @media (max-width: 1920px) {
    height: ${(props) =>
      props.tableExpanded
        ? 'calc(62.5vh - 59px - 80px - 39px - 37px - 24px - 26px)'
        : 'calc(99vh - 59px - 80px - 39px - 37px - 24px - 26px)'};
  }
  @media (max-width: 1920px) and (min-width: 1700px) {
    height: ${(props) =>
      props.tableExpanded
        ? 'calc(60.5vh - 59px - 80px - 39px - 37px - 24px - 26px)'
        : 'calc(99vh - 59px - 80px - 39px - 37px - 24px - 26px)'};
  }
`

export default ClassBody
