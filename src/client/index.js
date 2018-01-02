import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// eslint-disable-next-line
import { AppContainer } from 'react-hot-loader'
import routes from './routes'

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <HashRouter>{renderRoutes(routes)}</HashRouter>
    </AppContainer>,
    document.getElementById('app'),
  )
}

render()

if (module.hot) {
  module.hot.accept()
}
