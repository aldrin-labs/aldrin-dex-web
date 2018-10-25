import React, { SFC } from 'react'
import styled from 'styled-components'

import { Login } from '@containers/Login'
import { WithTheme } from '@material-ui/core/styles'
import withTheme from '@material-ui/core/styles/withTheme'
import MainLogo from '@icons/MainLogo.png'
import AppBar from '@material-ui/core/AppBar'
import { Toolbar, Button, Grid, PropTypes } from '@material-ui/core'
import { NavLink as Link } from 'react-router-dom'

export interface Props extends WithTheme {
  hide?: boolean
  pathname: string
}

export const navBarHeight = 48

const Portfolio = (props: any) => <Link to="/portfolio" {...props} />
const Chart = (props: any) => <Link to="/chart" {...props} />

const activeRoute = (
  route: string,
  button: string
): {
  color: PropTypes.Color
  variant: 'text' | 'contained'
} =>
  route === button
    ? { color: 'secondary', variant: 'contained' }
    : { color: 'primary', variant: 'text' }

const NavBarRaw: SFC<Props> = ({
  theme: {
    palette: {
      type,

      secondary: { main },
      primary,
    },
  },
  pathname,
  hide = false,
}) => (
  <Nav
    position="static"
    hide={hide}
    color="default"
    // style={{
    //   background: type === 'dark' ? primary[800] : primary[300],
    // }}
  >
    <Toolbar variant="dense" style={{ height: '48px' }}>
      <Grid container={true} alignContent={'stretch'}>
        <Grid style={{ display: 'flex' }} item={true} xs={2}>
          <Logo src={MainLogo} />
        </Grid>

        <Grid
          item={true}
          xs={8}
          justify="center"
          style={{ flexDirection: 'row', display: 'flex' }}
        >
          <Button
            style={{ margin: '0.5rem 1rem' }}
            size="small"
            component={Portfolio}
            {...activeRoute(pathname, '/portfolio')}
          >
            Portfolio
          </Button>

          <Button
            style={{ margin: '0.5rem 1rem' }}
            component={Chart}
            size="small"
            {...activeRoute(pathname, '/chart')}
          >
            Chart
          </Button>
        </Grid>
        <Grid item={true} xs={2}>
          <Login mainColor={main} />
        </Grid>
      </Grid>
    </Toolbar>
  </Nav>
)

export const NavBar = withTheme()(NavBarRaw)

const Nav = styled(AppBar)`
  z-index: 1;
  ${(props: { hide: boolean }) =>
    props.hide
      ? `opacity: 0;
    position: absolute;
    z-index: -100;`
      : ''};
`

const Logo = styled.img`
  z-index: 1;
  position: relative;
  margin: auto 0;

  @media (max-width: 768px) {
    margin: 0;
  }
`
