import * as AppBar from 'material-ui/AppBar'
import * as Toolbar from 'material-ui/Toolbar'
import * as Typography from 'material-ui/Typography'
import * as React from 'react'
import { compose } from 'recompose'
import * as styled from 'styled-components'

import NavButton from './NavButton'

const Nav = styled.div`
  width: '100%';
`

const STypography = styled(Typography)`
  flex: 1;
`

// TODO: Add another icon
const NavBar: React.SFC<{}> = () => (
  <Nav>
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton> */}
        <STypography type="title" color="inherit">
          Cryptocurrencies AI
        </STypography>
        <NavButton link="/" title="Coin Market Cap" />
        <NavButton link="/profile" title="Profile" />
        <NavButton link="/portfolio" title="Portfolio" />
        <NavButton link="/screener" title="Screener" />
        <NavButton link="/charts" title="Charts" />
        <NavButton link="/login" title="Login" />
      </Toolbar>
    </AppBar>
  </Nav>
)

export default compose()(NavBar)
