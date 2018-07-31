import React, { Component } from 'react'

import { ExchangeQuery } from '../../api'
import QueryRenderer from '@components/QueryRenderer'
import ExchangesTable from '@containers/Chart/Tables/ExchangesTable/Table/ExchangesTable'

const mockExchanges = [
  { name: 'OKEx', symbol: 'okex' },
  { name: 'Huobi', symbol: 'huobi' },
  { name: 'Bitfinex', symbol: 'bitfinex' },
  { name: 'Bitstamp', symbol: 'bitstamp' },
  { name: 'Coinbase Pro', symbol: 'coinbase' },
  { name: 'Huobi', symbol: 'huobi' },
  { name: 'DigiFinex', symbol: 'digifinex' },
  { name: 'ZB.COM', symbol: 'zbcom' },
]

const transformDataToExchanges = ({ data, ...props }) => {
  if (data && data.marketByName) {
    const exchanges =
      data.marketByName.length > 0
        ? [
            ...data.marketByName[0].exchanges.map(({ name, symbol }) => ({
              name,
              symbol,
            })),
            ...mockExchanges,
          ]
        : []

    console.log(data)

    return <ExchangesTable exchanges={exchanges} {...props} />
  }

  return null
}

class TableContainer extends Component {
  render() {
    return (
      <QueryRenderer
        component={transformDataToExchanges}
        query={ExchangeQuery}
        variables={{ marketName: this.props.marketName }}
        {...this.props}
      />
    )
  }
}

export default TableContainer
