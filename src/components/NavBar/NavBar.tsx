import React, { SFC } from 'react'
import { Login } from '@containers/Login'
import { WithTheme } from '@material-ui/core/styles'
import withTheme from '@material-ui/core/styles/withTheme'
import { Toolbar, Button, Grid } from '@material-ui/core'
import { NavLink as Link } from 'react-router-dom'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Hidden from '@material-ui/core/Hidden'

import MainLogo from '@icons/MainLogo.png'
import MainLogoDark from '@icons/MainLogoDarkColor.png'
import { Nav, Logo } from './NavBar.styles'
import Feedback from '@components/Feedback'

export interface Props extends WithTheme {
  hide?: boolean
  pathname: string
}

const Portfolio = (props: any) => <Link to="/portfolio" {...props} />
const Chart = (props: any) => <Link to="/chart" {...props} />

const NavBarRaw: SFC<Props> = ({
  theme: {
    transitions: {
      duration: { standard },
    },
    palette: {
      type,
      common,
      secondary: { main },
      primary,
      divider,
    },
  },
  pathname,
  hide = false,
}) => {
  const nonActiveButtonStyle =
    type === 'dark'
      ? { color: fade(common.white, 0.5), margin: '0.5rem 1rem' }
      : { color: fade(common.black, 0.5), margin: '0.5rem 1rem' }
  const activeButtonStyle = { margin: '0.5rem 1rem' }
  const createStyleForButton = (
    route: string,
    button: string
  ): { color?: string; margin?: string } =>
    route === button ? activeButtonStyle : nonActiveButtonStyle

  return (
    <Nav
      position="static"
      hide={hide}
      color="default"
      background={primary.main}
      className="Navbar"
    >
      <Toolbar variant="dense" style={{ height: '48px' }}>
        <Grid alignItems="center" container={true} alignContent={'stretch'}>
          <Hidden only={['sm', 'xs']}>
            <Grid item={true} md={4}>
              <Grid container={true}>
                <Logo src={!(type === 'dark') ? MainLogoDark : MainLogo} />
              </Grid>
            </Grid>
          </Hidden>
          <Grid item={true} md={3} sm={5}>
            <Grid
              justify="flex-end"
              container={true}
              style={{ flexDirection: 'row', display: 'flex' }}
            >
              <Button
                style={createStyleForButton(pathname, '/portfolio')}
                size="small"
                component={Portfolio}
                color="default"
                variant="text"
              >
                Portfolio
              </Button>

              <Button
                style={createStyleForButton(pathname, '/chart')}
                component={Chart}
                size="small"
                variant="text"
                color="default"
              >
                Chart
              </Button>
            </Grid>
          </Grid>

          <Grid item={true} md={5} sm={7}>
            <Grid
              justify="flex-end"
              wrap="nowrap"
              direction={'row'}
              container={true}
            >
              <Hidden only={['sm', 'xs']}>
                <Feedback borderColor={fade(divider, 0.5)} />
              </Hidden>

              <Login mainColor={main} />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </Nav>
  )
}

export const NavBar = withTheme()(NavBarRaw)
