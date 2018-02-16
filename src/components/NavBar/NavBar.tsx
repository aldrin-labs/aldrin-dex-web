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

const STypography = styled(Typography)`
  flex: 1;
`

// TODO: Add another icon
export const NavBar: SFC<{}> = () => (
  <Nav>
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton> */}
        {/* <STypography type="title" color="inherit">
          Cryptocurrencies AI
        </STypography> */}
        <NavButton link="/login" title="Coin Market Cap" />
        {/* <NavButton link="/profile" title="Profile" />
        <NavButton link="/portfolio" title="Portfolio" />
        <NavButton link="/screener" title="Screener" />
        <NavButton link="/chart" title="Chart" />
        <NavButton link="/login" title="Login" /> */}
        {/* <STypography><Link to="/profile">Profile</Link></STypography> */}
      </Toolbar>
    </AppBar>
  </Nav>
)
