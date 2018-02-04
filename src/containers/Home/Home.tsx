import React from 'react'

import { NavBar } from '@components/NavBar'

import { CoinMarketCap } from '@containers/CoinMarketCap'

export const Home = () => (
  <div>
    <NavBar />
    <CoinMarketCap />
  </div>
)
