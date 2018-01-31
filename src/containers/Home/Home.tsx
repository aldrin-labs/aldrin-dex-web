import { NavBar } from '@components/NavBar'
import React from 'react'

import { CoinMarketCap } from '@containers/CoinMarketCap'

export const Home = () => (
  <div>
    <NavBar />
    <CoinMarketCap />
  </div>
)
