import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'

import { withErrorFallback } from '@hoc/withErrorFallback'

import { KeysList, AddExchangeKey } from './components'

const UserContainer: any = ({ profile }: any): any =>
  (
    <UserWrap>
      <AddExchangeKey />
      <KeysList />
    </UserWrap>
  )

const UserWrap = styled.div`
  display: flex;
  margin: 10px;
`

export const User = compose(withErrorFallback)(UserContainer)
