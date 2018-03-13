import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'

import { withErrorFallback } from '@hoc/withErrorFallback'

import { KeysList, AddExchangeKey } from './components'
import * as actions from './actions'
import * as selectors from './selectors'
import * as API from './api'

const UserWrapper = styled.div`
  display: flex;
  margin: 10px;
`

const SettingsContainer = ({ profile }: any) => {
  return (
    <SettingsWrapper>
      <AddExchangeKey />
      {/* <KeysList /> */}
    </SettingsWrapper>
  )
}

export const User = compose(
 withErrorFallback)(SettingsContainer)
