import React, { SFC, Fragment } from 'react'

import { NavBar } from '@components/NavBar'
import { ProfileTable } from './ProfileTable'

export const Profile = () => (
  <Fragment>
    <NavBar />
    <ProfileTable />
  </Fragment>
)
