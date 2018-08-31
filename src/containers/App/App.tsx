import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { blueGrey, cyan } from '@material-ui/core/colors'
import { withRouter } from 'react-router-dom'

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
import Footer from '@components/Footer'

import { NavBarMobile } from '@components/NavBar/NavBarMobile'
import { NavBar } from '@components/NavBar/NavBar'

let theme = {}
if (process.browser) {
  window.theme = theme
}

const AppRaw = ({ children, themeMode }: any) => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider
      theme={() =>
        // ToDo  removes this
        createMuiTheme({
          palette: {
            type: themeMode,
            primary: blueGrey,
            secondary: {
              ...cyan,
              main: '#4ed8da'
            },
          },
        })
      }
    >
      <CssBaseline />
      <AppGridLayout>
        <NavBar />
        {children}
        <NavBarMobile />
      </AppGridLayout>
      <Footer />
    </MuiThemeProvider>
  </JssProvider>
)

const AppGridLayout = styled.div`
  min-height: calc(100vh - 50px);
`

const mapStateToProps = (store: any) => ({
  themeMode: store.ui.theme,
})

export const App = withRouter(connect(mapStateToProps)(AppRaw))
