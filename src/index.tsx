import { Chart } from '@components/Chart'
import { App } from '@containers/App'
import { Login } from '@containers/Login'
import { NotFound } from '@containers/NotFound'
import { Portfolio } from '@containers/Portfolio'
import { Profile } from '@containers/Profile'
import { Screener } from '@containers/Screener'
import { client } from '@utils/apolloClient'
import { store, persistor } from '@utils/configureStore'

import createHistory from 'history/createBrowserHistory'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Router, Switch } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react'

const history = createHistory()

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/profile" component={Profile} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/login" component={Login} />
          <Route path="/chart" component={Chart} />
          <Route path="/screener" component={Screener} />
          <Route path="*" component={NotFound} />
        </Switch>
      </ConnectedRouter>
      </PersistGate>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  )

render(hot(module)(App))
