import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'

import { withErrorFallback } from '@hoc/withErrorFallback'

import { KeysList, AddExchangeKey } from './components'

const UserWrap = styled.div`
  display: flex;
  margin: 10px;
`

const UserContainer: any = ({ profile }: any): any =>
  (
    <UserWrap>
      <AddExchangeKey />
      <KeysList />
    </UserWrap>
  )

export const User = compose(withErrorFallback)(UserContainer)
