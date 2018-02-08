import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { Route } from 'react-router'

import { client } from '@utils/apolloClient'
import configureStore from '@utils/configureStore'
import createReducer from '@utils/rootReducer'

import { Chart } from '@components/Chart'
import { App } from '@containers/App'
import { Login } from '@containers/Login'
import { NotFound } from '@containers/NotFound'
import { Portfolio } from '@containers/Portfolio'
import { Profile } from '@containers/Profile'
import { Screener } from '@containers/Screener'

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/profile" component={Profile} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/login" component={Login} />
          <Route path="/chart" component={Chart} />
          <Route path="/screener" component={Screener} />
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  )

render(hot(module)(App))
