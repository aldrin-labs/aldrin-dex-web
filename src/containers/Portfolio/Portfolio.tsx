import React, { Fragment, SFC } from 'react'
import styled from 'styled-components'

import { NavBar } from '@components/NavBar'
import { PortfolioTable } from './PortfolioTable'
import { SelectAccount } from './SelectAccount'

const SWrapper = styled.div`
  display: flex;
  margin-top: 5px;
`

export const Portfolio = () => (
  <Fragment>
    <NavBar />
    <SWrapper>
    <SelectAccount />
    <PortfolioTable />
  </SWrapper>
  </Fragment>
)
