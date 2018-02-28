import React, { Fragment, SFC } from 'react'
import styled from 'styled-components'

import { ProfileTable } from './ProfileTable'
import { ProfileKeys } from './ProfileKeys'
import { AddExchangeKey } from '@components/AddExchangeKey'

const SWrapper = styled.div`
  display: flex;
  margin-top: 5px;
`

export const Profile = () => (
  <SWrapper>
    {/* <ProfileKeys /> */}
    {/* <ProfileTable /> */}
    <AddExchangeKey />
  </SWrapper>
)
