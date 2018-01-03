import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { font } from 'styled-theme'
import HomePage from 'components/pages/HomePage'

const Title = styled.h1`
  font-family: ${font('text')};
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
    <HomePage>
      <Title>Test</Title>
    </HomePage>
  </div>
)

const SamplePageWithData = graphql(MY_QUERY)(props => <SamplePage />)

const App = () => <SamplePage />
export default App
