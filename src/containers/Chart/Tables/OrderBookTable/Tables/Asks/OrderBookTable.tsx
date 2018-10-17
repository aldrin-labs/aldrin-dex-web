import React, { Component } from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { difference } from 'lodash-es'

import { TypographyFullWidth } from '@styles/cssUtils'
import { Table, Row, Title, Head, HeadCell } from '@components/OldTable/Table'
import OrderBookBody from '@containers/Chart/Tables/OrderBookTable/Tables/Asks/OrderBookBody/OrderBookBody'
import { EmptyCell } from '@containers/Chart/Tables/SharedStyles'
import { TypographyWithCustomColor } from '@styles/StyledComponents/TypographyWithCustomColor'
import { IProps } from './OrderBookTable.types'

let index: number | null = null

class OrderBookTable extends Component<IProps> {
  shouldComponentUpdate(nextProps: IProps) {
    const shouldUpdate =
      difference(nextProps.data, this.props.data).length > 0 ||
      nextProps.activeExchange.index !== this.props.activeExchange.index ||
      nextProps.currencyPair !== this.props.currencyPair ||
      (this.props.data.length > 0 && nextProps.data.length === 0) ||
      nextProps.tableExpanded !== this.props.tableExpanded

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
      onButtonClick,
      quote,
      theme: { palette },
    } = this.props

    const { background, action, type, primary } = palette

    return (
      <AsksTable>
        <Title background={primary[type]}>
          <TypographyWithCustomColor
            textColor={palette.getContrastText(primary[type])}
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

const AsksTable = styled(Table)`
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
