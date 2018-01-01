import React from 'react'
import ReactDOM from 'react-dom'
import {
  ApolloProvider,
  ApolloClient,
  createNetworkInterface,
} from 'react-apollo'

import App from './containers/App'

const mountNode = document.getElementById('app')
ReactDOM.render(<App />, mountNode)

if (module.hot) {
  module.hot.accept()
}
