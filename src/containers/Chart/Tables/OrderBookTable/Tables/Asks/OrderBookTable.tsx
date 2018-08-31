import React, { Component } from 'react'
import styled from 'styled-components'
import { Button, Typography } from '@material-ui/core'
import { difference } from 'lodash'

import { TypographyFullWidth } from '@utils/cssUtils'
import { Table, Row, Title, Head, HeadCell } from '@components/Table/Table'
import OrderBookBody from '@containers/Chart/Tables/OrderBookTable/Tables/Asks/OrderBookBody/OrderBookBody'
import { EmptyCell } from '@containers/Chart/Tables/SharedStyles'
import { TypographyWithCustomColor } from '@styles/components'

let index: number | null = null

class OrderBookTable extends Component {
  shouldComponentUpdate(nextProps) {
    const shouldUpdate =
      difference(nextProps.data, this.props.data).length > 0 ||
      nextProps.activeExchange.index !== this.props.activeExchange.index ||
      nextProps.currencyPair !== this.props.currencyPair ||
      (this.props.data.length > 0 && nextProps.data.length === 0) ||
      nextProps.tableExpanded !== this.props.tableExpanded

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
      tableExpanded,
    } = this.props

    const {
      background,
      action,
      primary: { main },
    } = palette

    return (
      <AsksTable>
        <Title background={main}>
          <TypographyWithCustomColor
            textColor={palette.getContrastText(main)}
            variant="subheading"
            align="center"
          >
            Order Book
          </TypographyWithCustomColor>
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
                textColor={palette.getContrastText(background.default)}
                variant="subheading"
                color="default"
                align="right"
              >
                Trade Size
              </TypographyFullWidth>
            </HeadCell>
            <HeadCell width={'45%'}>
              <TypographyFullWidth
                textColor={palette.getContrastText(background.default)}
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
        {/* hack to autoscroll to bottom */}
        <OrderBookBody
          {...{
            background,
            action,
            index,
            ...this.props,
          }}
        />
      </AsksTable>
    )
  }
}

const AsksTable = Table.extend`
  height: 50%;
  flex-direction: column;
  justify-content: flex-start;
  display: flex;
  @media (min-width: 1920px) {
    flex-wrap: nowrap;
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

export default OrderBookTable
