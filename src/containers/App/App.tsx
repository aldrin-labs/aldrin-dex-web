import React from 'react'

import Reboot from 'material-ui/Reboot'
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'

import { Home } from '@containers/Home'

// TODO: 2 themes

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#FAFAFA',
      main: '#FAFAFA',
      dark: '#EEEEEE',
      contrastText: '#000',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
})

if (process.browser) {
  window.theme = theme
}

export const App = () => (
  <main>
    <MuiThemeProvider theme={theme}>
      <Reboot />
      <Home />
    </MuiThemeProvider>
  </main>
)
