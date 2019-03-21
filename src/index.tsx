import React, { Suspense, lazy } from 'react'
import createHistory from 'history/createBrowserHistory'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { App } from '@sb/compositions/App/'
import { client } from '@core/graphql/apolloClient'
import { persistor, store } from '@core/redux/configureStore'
import { ErrorBoundary } from '@sb/components/index'
import { Loading } from '@sb/components'
const ChartRoutes = lazy(() => import('@routes/chartRoute'))
const NotFound = lazy(() => import('@sb/components/NotFound'))
const PortfolioRoutes = lazy(() => import('@routes/portfolioRoute'))
const UserRoutes = lazy(() => import('@routes/userRoute'))
const MarketRoutes = lazy(() => import('@routes/coinMarketCapRoute'))

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

const history = createHistory()

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <IntlProvider locale="en">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
              <App>
                <ErrorBoundary>
                  <Suspense fallback={<Loading centerAligned />}>
                    <Switch>
                      <Redirect from="/" to="/portfolio/main" exact />
                      <Redirect from="/portfolio" to="/portfolio/main" exact />

                      {/*<Route exact path="/" component={HomeRoutes} />*/}
                      {/*<Route exact path="/profile" component={ProfileRoutes} />*/}
                      <Route
                        path="/portfolio"
                        component={PortfolioRoutes}
                      />
                      {<Route exact path="/market" component={MarketRoutes} />}
                      <Route exact path="/chart" component={ChartRoutes} />
                      {/*<Route exact path="/screener" component={ScreenerRoutes} />x*/}
                      <Route exact path="/user" component={UserRoutes} />
                      <Route path="*" component={NotFound} />
                    </Switch>
                  </Suspense>
                </ErrorBoundary>
              </App>
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </IntlProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )

render(hot(module)(App))
