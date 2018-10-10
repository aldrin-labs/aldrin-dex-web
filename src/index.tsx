import { App } from '@containers'

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
import { Route, Switch, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loadable from 'react-loadable'

import { ErrorFallback } from 'components'
import LoadableLoading from '@components/Loading/LoadableLoading'

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

const history = createHistory()

const HomeRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "home" */ '@containers/Home/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['home'],
  webpack: () => [require.resolveWeak('./containers/Home/routes')],
})

const ProfileRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "profile" */ '@containers/Profile/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['profile'],
  webpack: () => [require.resolveWeak('./containers/Profile/routes')],
})

const PortfolioRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "portfolio" */ '@containers/Portfolio/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['portfolio'],
  webpack: () => [require.resolveWeak('./containers/Portfolio/routes')],
})

const MarketRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "market" */ '@containers/CoinMarketCap/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['market'],
  webpack: () => [require.resolveWeak('./containers/CoinMarketCap/routes')],
})

const ChartRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "chart" */ '@containers/Chart/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['chart'],
  webpack: () => [require.resolveWeak('./containers/Chart/routes')],
})

const ScreenerRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "screener" */ '@containers/Screener/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['screener'],
  webpack: () => [require.resolveWeak('./containers/Screener/routes')],
})

const UserRoutes = Loadable({
  loader: () =>
    import(/* webpackChunkName: "user" */ '@containers/User/routes'),
  delay: 300,
  loading: LoadableLoading,
  modules: ['user'],
  webpack: () => [require.resolveWeak('./containers/User/routes')],
})

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <IntlProvider locale="en">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
              <App>
                <ErrorFallback />
                <Switch>
                  <Redirect from="/" to="/portfolio" exact />
                  {/*<Route exact path="/" component={HomeRoutes} />*/}
                  {/*<Route exact path="/profile" component={ProfileRoutes} />*/}
                  <Route exact path="/portfolio" component={PortfolioRoutes} />
                  {/*<Route exact path="/market" component={MarketRoutes} />*/}
                  <Route exact path="/chart" component={ChartRoutes} />
                  {/*<Route exact path="/screener" component={ScreenerRoutes} />x*/}
                  <Route exact path="/user" component={UserRoutes} />
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
