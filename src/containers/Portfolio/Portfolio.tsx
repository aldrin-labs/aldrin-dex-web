import React, { Fragment, SFC } from 'react'
import styled from 'styled-components'

import { PortfolioTable } from './PortfolioTable'
import { SelectAccount } from './SelectAccount'

const PortfolioContainer = styled.div`
  display: flex;
`

export const Portfolio = () => (
    <PortfolioContainer>
    <SelectAccount />
    <PortfolioTable />
  </PortfolioContainer>
)
