import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { normalize } from 'polished'
import fetch from 'node-fetch'
import { injectGlobal, ThemeProvider } from 'styled-components'
import theme from 'components/themes/default'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.example.com/graphql', fetch }),
  cache: new InMemoryCache(),
})
// eslint-disable-next-line
injectGlobal`
${normalize()}
`

const ClientContainer = ({ children }) => (
  <AppContainer>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ApolloProvider>
  </AppContainer>
)

if (module.hot) {
  module.hot.accept()
}

export default ClientContainer
