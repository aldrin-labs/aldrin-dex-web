import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { AppContainer } from 'react-hot-loader'
import { normalize } from 'polished'
import { injectGlobal, ThemeProvider } from 'styled-components'
import theme from 'components/themes/default'

import routes from './routes'

// eslint-disable-next-line
injectGlobal`
${normalize()}
`

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.example.com/graphql' }),
  cache: new InMemoryCache(),
})

// eslint-disable-next-line

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <HashRouter>{renderRoutes(routes)}</HashRouter>
        </ThemeProvider>
      </ApolloProvider>
    </AppContainer>,
    document.getElementById('app'),
  )
}

render()

if (module.hot) {
  module.hot.accept()
}
