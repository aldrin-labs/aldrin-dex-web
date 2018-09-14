import React, { Component } from 'react'
import posed from 'react-pose'
import styled from 'styled-components'

import { NavBar } from '@components/NavBar'

export interface Props {
  hide?: boolean
  pathname: string
}
const AnimatedContainer = styled(
  posed.div({
    visible: { bottom: 0, opacity: 1 },
    hidden: { bottom: 100, opacity: 0.25 },
  })
)`
  position: relative;
`

export default class AnimatedNavBar extends Component<Props> {
  state = {
    delayedHide: false,
  }

  render() {
    const { hide, pathname } = this.props
    const { delayedHide } = this.state

    setTimeout(() => {
      this.setState({ delayedHide: hide })
    }, 300)

    return (
      <AnimatedContainer pose={hide ? 'hidden' : 'visible'}>
        {' '}
        <NavBar pathname={pathname} hide={delayedHide} />
      </AnimatedContainer>
    )
  }
}
