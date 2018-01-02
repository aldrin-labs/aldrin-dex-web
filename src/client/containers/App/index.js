import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
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
    <Link to="/sample-page">To sample page!</Link>
  </div>
)

const App = () => (
  <AppContainer>
    <SamplePage />
  </AppContainer>
)
export default App
