import React from 'react'

import Reboot from 'material-ui/Reboot'
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { Home } from '@containers/Home'
import { NavBar } from '@common'

// TODO: 2 themes

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#FAFAFA',
      main: '#FAFAFA',
      dark: '#EEEEEE',
      contrastText: '#000',
    },
    secondary: {
      light: '#ff7961',
      main: '#4ed8da',
      dark: '#4ed8da',
      contrastText: '#000',
    },
  },
})

if (process.browser) {
  window.theme = theme
}

export const App = ({ children }: any) => (
    <MuiThemeProvider theme={theme}>
      <Reboot />
      <NavBar />
      {children}
    </MuiThemeProvider>
)
