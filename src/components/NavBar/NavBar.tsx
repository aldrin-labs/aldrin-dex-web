import React, { SFC } from 'react'
import { Login } from '@containers/Login'
import { WithTheme } from '@material-ui/core/styles'
import withTheme from '@material-ui/core/styles/withTheme'
import { Toolbar, Button, Grid } from '@material-ui/core'
import { NavLink as Link } from 'react-router-dom'
import { fade } from '@material-ui/core/styles/colorManipulator'

import MainLogo from '@icons/MainLogo.png'
import { Nav, Logo } from './NavBar.styles'

export interface Props extends WithTheme {
  hide?: boolean
  pathname: string
}

const Portfolio = (props: any) => <Link to="/portfolio" {...props} />
const Chart = (props: any) => <Link to="/chart" {...props} />

const NavBarRaw: SFC<Props> = ({
  theme: {
    palette: {
      type,
      common,
      secondary: { main },
      primary,
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
      background={type === 'light' && primary[300]}
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
          <Grid item={true} xs={2}>
            <Login mainColor={main} />
          </Grid>
        </Grid>
      </Toolbar>
    </Nav>
  )
}

export const NavBar = withTheme()(NavBarRaw)
