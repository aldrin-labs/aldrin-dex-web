import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { blueGrey, cyan, green, red } from '@material-ui/core/colors'
import { withRouter } from 'react-router-dom'

// https://material-ui.com/customization/css-in-js/#other-html-element
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import {
  createGenerateClassName,
  jssPreset,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles'

const generateClassName = createGenerateClassName()
const jss = create(jssPreset())
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point')
//

import CssBaseline from '@material-ui/core/CssBaseline'
import Footer from '@components/Footer'

import { NavBarMobile } from '@components/NavBar/NavBarMobile'
import AnimatedNavBar from '@components/NavBar/AnimatedNavBar'

const version = `0.1`
const currentVersion = localStorage.getItem('version')
if (currentVersion !== version) {
  localStorage.clear()
  localStorage.setItem('version', version)
}

const AppRaw = ({
  children,
  themeMode,
  chartPageView,
  location: { pathname: currentPage },
}: any) => {
  const fullscreen: boolean =
    currentPage === '/chart' && chartPageView !== 'default'
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider
        theme={() =>
          // ToDo  removes this into separate file
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
          <AnimatedNavBar pathname={currentPage} hide={fullscreen} />
          {children}
          <NavBarMobile />
        </AppGridLayout>
        <Footer hide={fullscreen} />
      </MuiThemeProvider>
    </JssProvider>
  )
}

const AppGridLayout = styled.div`
  min-height: calc(100vh - 50px);
`

const mapStateToProps = (store: any) => ({
  themeMode: store.ui.theme,
  chartPageView: store.chart.view,
})

export const App = withRouter(connect(mapStateToProps)(AppRaw))
