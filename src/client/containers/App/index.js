import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import theme from '../../components/themes/default'

const Title = styled.h1`
  color: red;
`

const MY_QUERY = gql`
  query {
    todos {
      text
    }
  }
`

const SamplePage = () => (
  <div>
    <Title>Hello! Root page</Title>
    <Link to="/chart">To sample page!</Link>
  </div>
)

const SamplePageWithData = graphql(MY_QUERY)(props => <SamplePage />)

const App = () => <SamplePage />
export default App
