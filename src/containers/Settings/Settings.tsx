import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'

import Typography from 'material-ui/Typography'

import { Loading } from '@components/Loading'
import { withErrorFallback } from '@hoc'

import { KeysList } from './KeysList'
import * as actions from './actions'
import * as selectors from './selectors'

const SettingsWrapper = (props: any) => {
  return (
    <div>
      <KeysList />
    </div>
  )
}

export const Settings = compose(withErrorFallback)(
  SettingsWrapper
)
