import React from 'react'

import ExchangesTable from '@containers/Chart/Tables/ExchangesTable/Table/ExchangesTable'
import { mockExchanges } from '@containers/Chart/Tables/ExchangesTable/mockExchanges'

const transformDataToExchangesTable = ({ data, ...props }) => {
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

    return <ExchangesTable exchanges={exchanges} {...props} />
  }

  return null
}

export default transformDataToExchangesTable
