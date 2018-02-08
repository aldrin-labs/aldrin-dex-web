import { NavBar } from '@components/NavBar'

import React, { PureComponent, ReactNode } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import styled from 'styled-components'

import Selector from './Selector'
import UserForm from './UserForm'
export const ScreenerBase = () => (
  <div>
    <NavBar/>
    <Selector />
  </div>
)

export const Screener = compose(
  connect(state => ({
    count: console.log(state)
})))(ScreenerBase)
