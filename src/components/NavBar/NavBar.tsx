import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import React, { SFC } from 'react'
import styled from 'styled-components'

import { NavButton } from './NavButton'

import { Link } from 'react-router-dom'

const Nav = styled.div`
  width: '100%';
`

const SNav = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`

// TODO: Add another icon
export const NavBar: SFC<{}> = () => (
  <Nav>
    <AppBar position="static">
    <SNav>
    <Toolbar>
        {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton> */}
        <NavButton link="/" title="Home" />
        <NavButton link="/profile" title="Profile" />
        <NavButton link="/portfolio" title="Portfolio" />
        <NavButton link="/screener" title="Screener" />
        <NavButton link="/chart" title="Chart" />
      </Toolbar>
      <Toolbar><NavButton link="/login" title="Login" /></Toolbar>
    </SNav>
    </AppBar>
  </Nav>
)
