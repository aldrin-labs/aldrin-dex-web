import React from 'react'
import styled from 'styled-components'

import { PortfolioTable, PortfolioSelector } from './components'

const PortfolioContainer = styled.div`
  display: flex;
`

export const Portfolio = () => (
  <PortfolioContainer>
    <PortfolioSelector />
    <PortfolioTable />
  </PortfolioContainer>
)
