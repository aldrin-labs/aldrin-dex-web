import {
  App,
  Chart,
  CoinMarketCap,
  Home,
  LoginQuery,
  Portfolio,
  Profile,
  Screener,
  Settings,
  AssetInfo,
} from '@containers/index'

import { client } from '@utils/apolloClient'
import { persistor, store } from '@utils/configureStore'
import { NotFound } from '@components/NotFound'

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
                  <Route exact path="/market" component={CoinMarketCap} />
                  <Route path="/asset/:name" component={AssetInfo} />
                  <Route exact path="/profile" component={Profile} />
                  <Route exact path="/portfolio" component={Portfolio} />
                  <Route exact path="/login" component={LoginQuery} />
                  <Route exact path="/chart" component={Chart} />
                  <Route exact path="/screener" component={Screener} />
                  <Route exact path="/settings" component={Settings} />
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
