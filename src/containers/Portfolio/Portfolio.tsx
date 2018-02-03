import React, { Fragment, SFC } from 'react'

import { NavBar } from '@components/NavBar'
import { PortfolioTable } from './PortfolioTable'
import { SelectAccount } from './SelectAccount'

export const Profile = () => (
  <Fragment>
    <NavBar />
    <PortfolioTable />
    <SelectAccount />
  </Fragment>
)
