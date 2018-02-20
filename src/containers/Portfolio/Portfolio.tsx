import React, { Fragment, SFC } from 'react'
import styled from 'styled-components'

import { PortfolioTable } from './PortfolioTable'
import { SelectAccount } from './SelectAccount'

const SWrapper = styled.div`
  display: flex;
  margin-top: 5px;
`

export const Portfolio = () => (
    <SWrapper>
    <SelectAccount />
    <PortfolioTable />
  </SWrapper>
)
