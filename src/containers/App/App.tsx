import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { blueGrey, cyan, green, red } from '@material-ui/core/colors'
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

const version = `0.1`
const currentVersion = localStorage.getItem('version')
if (currentVersion !== version) {
  localStorage.clear()
  localStorage.setItem('version', version)
}

const AppRaw = ({ children, themeMode }: any) => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider
      theme={() =>
        // ToDo  removes this
        {
          const theme = createMuiTheme({
            palette: {
              type: themeMode,
              red: {
                main: red[400],
              },
              green: {
                main: green['500'],
              },
              primary: blueGrey,
              secondary: {
                ...cyan,
                main: '#4ed8da',
              },
              background: {
                default: themeMode === 'light' ? '#fafafa' : '#303030',
                paper: themeMode === 'light' ? '#fff' : '#393e44',
              },
              navbar: {
                light: '#fff',
                dark: 'rgb(45, 49, 54)',
              },
            },
          })

          if (process.browser) {
            window.theme = theme
          }
          return theme
        }
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
