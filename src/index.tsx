import {
  App,
  Chart,
  CoinMarketCap,
  Portfolio,
  Profile,
  Screener,
  User,
} from '@containers'

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
import Loadable from 'react-loadable'

import LoadableLoading from '@components/Loading/LoadableLoading'

const history = createHistory()

const HomeRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "home" */ './containers/Home/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['home'],
  webpack: () => [require.resolveWeak('./containers/Home/routes')],
})

const ProfileRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "profile" */ './containers/Profile/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['profile'],
  webpack: () => [require.resolveWeak('./containers/Profile/routes')],
})

const PortfolioRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "portfolio" */ './containers/Portfolio/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['portfolio'],
  webpack: () => [require.resolveWeak('./containers/Portfolio/routes')],
})

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <IntlProvider locale="en">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
              <App>
                <Switch>
                  <Route exact path="/" component={HomeRoutes} />
                  <Route exact path="/profile" component={ProfileRoutes} />
                  <Route exact path="/portfolio" component={PortfolioRoutes} />
                  <Route exact path="/market" component={CoinMarketCap} />
                  <Route exact path="/chart" component={Chart} />
                  <Route exact path="/screener" component={Screener} />
                  <Route exact path="/user" component={User} />
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
