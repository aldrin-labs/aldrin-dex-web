import React from 'react'

import Reboot from 'material-ui/Reboot'
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { Home } from '@containers/Home'
import { NavBar } from '@components/NavBar'

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

const Yoba = (props) => <div>{console.log(props)}</div>

const YobaX = compose(
  connect(state => ({
    test: console.log(12345, state)
  }))
)(Yoba)

export const App = ({ children }: any) => (
    <MuiThemeProvider theme={theme}>
      <Reboot />
      <NavBar />
      <YobaX />
      {children}
    </MuiThemeProvider>
)
