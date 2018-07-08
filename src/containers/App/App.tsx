import React from 'react'

// https://material-ui.com/customization/css-in-js/#other-html-element
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

const generateClassName = createGenerateClassName()
const jss = create(jssPreset())
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point')
//

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
      main: '#FAFAFA',
      dark: '#EEEEEE',
      contrastText: '#000',
    },
    secondary: {
      light: '#ff7961',
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
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      {children}
      <NavBarMobile />
    </MuiThemeProvider>
  </JssProvider>
)
