import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import styled from 'styled-components'

import Selector from './Selector'
import ScreenerTable from './ScreenerTable/ScreenerTable.tsx'

import UserForm from './UserForm'
export const ScreenerBase = () => (
  <div>
    <Selector />
    <ScreenerTable />
  </div>
)

export const Screener = compose(
  connect(state => ({
    count: console.log(state)
})))(ScreenerBase)
