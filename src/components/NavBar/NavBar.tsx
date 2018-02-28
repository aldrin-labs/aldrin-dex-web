import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import React, { SFC } from 'react'
import styled from 'styled-components'

import { NavButton } from './NavButton'
import { Login } from '@containers/Login'

const Nav = styled.div`
  width: '100%';
`

const SNav = styled.nav`
  display: flex;
  width: 60%;
  margin: 0 auto;
  justify-content: space-between;
  flex-direction: row;
`

export const NavBar: SFC<{}> = () => (
  <Nav>
    <AppBar color="inherit" position="static">
    <SNav>
    <Toolbar>
        <NavButton link="/" title="Home" />
        <NavButton link="/market" title="Coin Market" />
        <NavButton link="/profile" title="Profile" />
        <NavButton link="/portfolio" title="Portfolio" />
        <NavButton link="/screener" title="Screener" />
        <NavButton link="/chart" title="Chart" />
      </Toolbar>
      <Toolbar><Login /></Toolbar>
    </SNav>
    </AppBar>
  </Nav>
)
