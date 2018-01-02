import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import theme from '../../components/themes/default'

const AppContainer = styled.div`
  font-size: 20px;
`

const Title = styled.h1`
  color: red;
`

const MY_QUERY = gql`query { todos { text } }`

const SamplePage = () => (
  <div>
    <Title>Hello! Root page</Title>
    <Link to="/sample-page">To sample page!</Link>
  </div>
)

const SamplePageWithData = graphql(MY_QUERY)(props => <SamplePage />)

const App = () => (
  <AppContainer>
    <SamplePage />
  </AppContainer>
)
export default App
