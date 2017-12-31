import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import Typography from 'material-ui/Typography'

import { HomePage } from '../../components'
import theme from '../../components/themes/default'

const AppContainer = styled.div`
  font-size: 20px;
`

const Title = styled(Typography)`
  && {
    color: red;
  }
`

const App = () => (
  <ThemeProvider theme={theme}>
    <AppContainer>
      <Title type="title">Application</Title>
    </AppContainer>
  </ThemeProvider>
)
export default App

// <Switch>
// <Route path="/" component={HomePage} exact />
// <Route path="/sample-page" component={SamplePage} />
// <Route component={NotFoundPage} />
// </Switch>
