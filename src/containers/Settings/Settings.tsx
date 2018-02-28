import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'

import Typography from 'material-ui/Typography'

import { Loading } from '@components/Loading'
import { withErrorFallback } from '@hoc/index'
import { AddExchangeKey } from '@components/AddExchangeKey'

import { KeysList } from './KeysList'
import * as actions from './actions'
import * as selectors from './selectors'

const SettingsWrapper = styled.div`
  display: flex;
  margin: 10px;
`

const SettingsContainer = (props: any) => {
  return (
    <SettingsWrapper>
      <AddExchangeKey />
      <KeysList />
    </SettingsWrapper>
  )
}

export const Settings = compose(withErrorFallback)(
  SettingsContainer
)
