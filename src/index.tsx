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

import { App } from '@containers/index'
import { client } from '@graphql/apolloClient'
import { persistor, store } from '@utils/configureStore'
import ErrorBoundary from '@components/ErrorFallback/ErrorFallback'
import { Loading } from '@components/index'
const ChartRoutes = lazy(() => import('@containers/Chart/routes'))
const NotFound = lazy(() => import('@components/NotFound'))
const UserRoutes = lazy(() => import('@containers/User/routes'))
const PortfolioRoutes = lazy(() => import('@containers/Portfolio/routes'))
const MarketRoutes = lazy(() => import('@containers/CoinMarketCap/routes'))

import _Group_ from './images-for-mail/_Group_.png'
import _Group_1 from './images-for-mail/_Group_1.png'
import _Group_2 from './images-for-mail/_Group_2.png'
import _Group_3 from './images-for-mail/_Group_3.png'
import _LinkedFile_ from './images-for-mail/_LinkedFile_.png'


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
                <img src={_Group_} />
                <img src={_Group_1} />
                <img src={_Group_2} />
                <img src={_Group_3} />
                <img src={_LinkedFile_} />
                <ErrorBoundary>
                  <Suspense fallback={<Loading centerAligned />}>
                    <Switch>
                      <Redirect from="/" to="/portfolio" exact />
                      {/*<Route exact path="/" component={HomeRoutes} />*/}
                      {/*<Route exact path="/profile" component={ProfileRoutes} />*/}
                      <Route
                        exact
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
