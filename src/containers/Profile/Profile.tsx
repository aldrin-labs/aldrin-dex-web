import React, { Fragment, SFC } from 'react'
import styled from 'styled-components'

import { ProfileTable } from './ProfileTable'
import { ProfileKeys } from './ProfileKeys'

const SWrapper = styled.div`
  display: flex;
  margin-top: 5px;
`

export const Profile = () => (
  <SWrapper>
    <ProfileKeys />
    <ProfileTable />
  </SWrapper>
)
