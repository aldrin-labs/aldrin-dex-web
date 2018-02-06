import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { routerReducer, routerMiddleware, ConnectedRouter } from 'react-router-redux'

import { App } from '@containers/App'
import { Login } from '@containers/Login'
import { NotFound } from '@containers/NotFound'
import { Portfolio } from '@containers/Portfolio'
import { Profile } from '@containers/Profile'
import { Chart } from '@components/Chart'

import { client } from '@utils/apolloClient'

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/profile" component={Profile} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/login" component={Login} />
          <Route path="/chart" component={Chart} />
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
  )

render(hot(module)(App))
