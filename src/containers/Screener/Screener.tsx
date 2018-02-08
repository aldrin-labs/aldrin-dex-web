import React, { PureComponent, ReactNode } from 'react'
import styled from 'styled-components'
import { NavBar } from '@components/NavBar'
import { compose } from 'recompose'
import { connect } from 'react-redux'

export const ScreenerBase = () => (
  <div>
    <NavBar/>
  </div>
)

export const Screener = compose(
  connect(state => ({
    count: console.log(state)
})))(ScreenerBase)
