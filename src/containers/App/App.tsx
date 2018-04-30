import React from 'react'
import CssBaseline from 'material-ui/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'
import { NavBar } from '@components'
import Footer from '@components/Footer'

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
    <CssBaseline />
    <NavBar />
    {children}
    <Footer />
  </MuiThemeProvider>
)
