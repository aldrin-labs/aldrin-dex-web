import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
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

import CssBaseline from '@material-ui/core/CssBaseline'
import Footer from '@components/Footer'

import AnimatedNavBar from '@components/NavBar/AnimatedNavBar'
import ThemeWrapper from './ThemeWrapper/ThemeWrapper'
import { Hidden, Typography, Paper, Fade } from '@material-ui/core'
import { toggleMobilePopup } from './actions'

const version = `1`
const currentVersion = localStorage.getItem('version')
if (currentVersion !== version) {
  localStorage.clear()
  localStorage.setItem('version', version)
}

function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  )
}

const AppRaw = ({
  children,
  themeMode,
  chartPageView,
  mobilePopup,
  togglePopUp,
  location: { pathname: currentPage },
}: any) => {
  const fullscreen: boolean =
    currentPage === '/chart' && chartPageView !== 'default'

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <ThemeWrapper themeMode={themeMode}>
        <CssBaseline />
        <AppGridLayout>
          <AnimatedNavBar pathname={currentPage} hide={fullscreen} />
          {children}
        </AppGridLayout>
        <Footer hide={fullscreen} />

        <Fade in={true && mobilePopup} mountOnEnter unmountOnExit>
          <DontUseOnMobileWarning
            onClick={() => {
              togglePopUp()
            }}
          >
            <Typography color="error" variant="h4">
              😞We are currently in beta and don't support your screen
              resolution. Please open the desktop version of this page.
            </Typography>
            <Typography color="error" variant="h3">
              Click to close!
            </Typography>
          </DontUseOnMobileWarning>
        </Fade>
      </ThemeWrapper>
    </JssProvider>
  )
}

// put overflow-x hidden since
// we dont need it to horizontal scrollbar
// on whole page
const AppGridLayout = styled.div`
  overflow-x: hidden;
  min-height: calc(100vh - 50px);
`

const DontUseOnMobileWarning = styled(Paper)`
  height: 100vh;
  width: 100vw;
  display: flex;
  place-content: center;
  position: fixed;
  top: 0;
  z-index: 99999999;
  flex-direction: column;
`

const mapStateToProps = (store: any) => ({
  themeMode: store.ui.theme,
  mobilePopup: store.ui.mobilePopup,
  chartPageView: store.chart.view,
})

const mapDispatchToProps = (dispatch: any) => ({
  togglePopUp: () => dispatch(toggleMobilePopup()),
})

export const App = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppRaw)
)
