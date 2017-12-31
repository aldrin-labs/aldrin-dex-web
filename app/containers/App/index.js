import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

// import { HomePage, SamplePage, NotFoundPage } from '../../components/'

const AppContainer = styled.div`
  font-size: 20px;
`

import theme from '../../components/themes/default'

const App = () => (
  <ThemeProvider theme={theme}>
    <AppContainer>Hello!</AppContainer>
  </ThemeProvider>
)
export default App

// <Switch>
// <Route path="/" component={HomePage} exact />
// <Route path="/sample-page" component={SamplePage} />
// <Route component={NotFoundPage} />
// </Switch>
