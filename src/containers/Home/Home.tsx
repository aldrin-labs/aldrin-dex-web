import React from 'react'
import { NavBar } from '@components/NavBar'
import CoinMarketCap from '@containers/CoinMarketCap'
import Title from '@components/Title'

export const Home = () => (
  <div>
    <NavBar />
    <Title>Cryptocurrencies AI</Title>
    {/* <CoinMarketCap /> */}
  </div>
)
