import React, { Component } from 'react'
import autoscrollReact from 'autoscroll-react'
import { red } from '@material-ui/core/colors'

import { Row, Body, Cell } from '@components/Table/Table'
import { TypographyFullWidth } from '@utils/cssUtils'
import { opacityAnimation } from '../../../../../../../styles/keyframes'
import { Loading } from '@components/Loading'
import { calculatePercentagesOfOrderSize } from '@utils/chartPageUtils'
import { EmptyCell } from '@containers/Chart/Tables/OrderBookTable/Tables/Asks/SharedStyles'
import { IProps } from './OrderBookBody.types'

class ClassBody extends Component<IProps> {
  render() {
    const {
      data,
      digitsAfterDecimalForAsksPrice,
      digitsAfterDecimalForAsksSize,
      tableExpanded,
      action,
      breakpoints,
      index,
      background,
      ...props
    } = this.props

    return (
      <StyledBody
        {...props}
        breakpoints={breakpoints.values}
        tableExpanded={tableExpanded}
        height={
          tableExpanded
            ? 'calc(60vh - 59px - 80px - 39px - 37px - 24px - 26px)'
            : 'calc(99vh - 59px - 80px - 39px - 37px - 24px - 26px)'
        }
      >
        {console.log(breakpoints)}
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
      </StyledBody>
    )
  }
}

const StyledBody = Body.extend`
  @media (max-width: ${(props: { breakpoints?: any }) =>
      `${props.breakpoints.xl}px`}) {
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

export default autoscrollReact(ClassBody)
