import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import { HomePage } from '../../components'
import theme from '../../components/themes/default'

const AppContainer = styled.div`
  font-size: 20px;
`

const Title = styled.h1`
  color: red;
`

const SamplePage = () => (
  <div>
    <Title>Hello! Root page</Title>
    <Link to={'/sample-page'}>To sample page!</Link>
  </div>
)

const AnotherSamplePage = () => (
  <div>
    <Title>Eeeee boiii</Title>
    <Link to={'/'}>To root page!</Link>
  </div>
)

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <AppContainer>
        <Switch>
          <Route path="/" component={SamplePage} exact />
          <Route path="/sample-page" component={AnotherSamplePage} />
          {/* <Route component={NotFoundPage} /> */}
        </Switch>
      </AppContainer>
    </Router>
  </ThemeProvider>
)
export default App
