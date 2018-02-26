import {
  App,
  Chart,
  CoinMarketCap,
  Home,
  LoginQuery,
  NotFound,
  Portfolio,
  Profile,
  Screener,
  Settings,
  AssetInfo,
} from './containers'

import { client } from '@utils/apolloClient'
import { persistor, store } from '@utils/configureStore'

import createHistory from 'history/createBrowserHistory'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { PersistGate } from 'redux-persist/integration/react'

const history = createHistory()

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <IntlProvider locale="en">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
              <App>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/market" component={CoinMarketCap} />
                  <Route path="/asset/:name" component={AssetInfo} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/portfolio" component={Portfolio} />
                  <Route path="/login" component={LoginQuery} />
                  <Route path="/chart" component={Chart} />
                  <Route path="/screener" component={Screener} />
                  <Route path="/settings" component={Settings} />
                  <Route path="*" component={NotFound} />
                </Switch>
              </App>
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </IntlProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )

render(hot(module)(App))
