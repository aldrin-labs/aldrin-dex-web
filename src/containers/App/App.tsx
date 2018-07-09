import React from 'react'

import CssBaseline from 'material-ui/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { Home } from '@containers/Home'
import { NavBar } from '@components'
import { NavBarMobile } from '@components'
// TODO: 2 themes

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#FAFAFA',
      main: '#757575',
      dark: '#607D8B',
      contrastText: '#000',
    },
    secondary: {
      light: '#B2EBF2',
      main: '#4ed8da',
      dark: '#3aa1a3',
      contrastText: '#000',
    },
  },
})

if (process.browser) {
  window.theme = theme
}

export const App = ({ children }: any) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <NavBar />
    {children}
    <NavBarMobile />
  </MuiThemeProvider>
)
