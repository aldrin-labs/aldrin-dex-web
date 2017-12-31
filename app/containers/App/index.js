import React from 'react'
import { Switch, Route, } from 'react-router-dom'
import { injectGlobal, ThemeProvider } from 'styled-components'

import { HomePage, SamplePage, NotFoundPage } from '../../components/'

import theme from '../../components/themes/default'

injectGlobal`
  body {
    margin: 0;
  }
`

const App = () => (
  <ThemeProvider theme={theme}>
    <Switch>
      <Route path="/" component={HomePage} exact />
      <Route path="/sample-page" component={SamplePage} />
      <Route component={NotFoundPage} />
    </Switch>
  </ThemeProvider>
)

export default App
