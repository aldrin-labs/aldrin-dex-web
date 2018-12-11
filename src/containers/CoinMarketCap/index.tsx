import * as React from 'react'
import { CoinMarket } from './CoinMarketCap'
import { data } from './mocks'

export const MyCoinMarket = (props) => {
  return (
    <CoinMarket
      data={data}
      {...props}
    />
  )
}

export default MyCoinMarket