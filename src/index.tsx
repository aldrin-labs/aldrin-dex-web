import React, { Suspense, lazy } from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { IntlProvider } from 'react-intl'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { App } from '@sb/compositions/App/'
import { client } from '@core/graphql/apolloClient'
import { ErrorBoundary } from '@sb/components/index'
import { Loading } from '@sb/components'
const ChartRoutes = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "chart" */ '@routes/chartRoute'))
const NotFound = lazy(() => import(/* webpackChunkName: "notFound" */ '@sb/components/NotFound'))
const PortfolioRoutes = lazy(() => import(/* webpackChunkName: "portfolio" */ '@routes/portfolioRoute'))
const ProfileRoutes = lazy(() => import(/* webpackChunkName: "profile" */ '@routes/profileRoute'))
const UserRoutes = lazy(() => import(/* webpackChunkName: "user" */ '@routes/userRoute'))
const MarketRoutes = lazy(() => import(/* webpackChunkName: "market" */ '@routes/coinMarketCapRoute'))
const SignalRoutes = lazy(() => import(/* webpackChunkName: "signal" */ '@routes/signalRoute'))
const OnboardingRoutes = lazy(() => import(/* webpackChunkName: "onboarding" */ '@routes/onboardingRoute'))
const LoginRoutes = lazy(() => import(/* webpackChunkName: "login" */ '@routes/loginRoutes'))

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <IntlProvider locale="en">
        <BrowserRouter>
          <App>
            <ErrorBoundary>
              <Suspense fallback={<Loading centerAligned />}>
                <Switch>
                  <Route path="/login" component={LoginRoutes} />
                  <Route path="/signin" component={LoginRoutes} />
                  <Route path="/signup" component={LoginRoutes} />

                  <Route path="/registration" component={OnboardingRoutes} />
                  <Redirect from="/" to="/portfolio/main" exact />
                  <Redirect from="/portfolio" to="/portfolio/main" exact />
                  <Redirect from="/chart" to="/chart/spot" exact />

                  {/*<Route exact path="/" component={HomeRoutes} />*/}
                  <Route path="/profile" component={ProfileRoutes} />
                  <Route path="/portfolio" component={PortfolioRoutes} />
                  {<Route exact path="/market" component={MarketRoutes} />}
                  {<Route exact path="/signals" component={SignalRoutes} />}
                  <Route path="/chart" component={ChartRoutes} />
                  {/*<Route exact path="/screener" component={ScreenerRoutes} />x*/}
                  <Route exact path="/user" component={UserRoutes} />
                  <Route path="*" component={NotFound} />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </App>
        </BrowserRouter>
      </IntlProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )

render(hot(module)(App))


if ('serviceWorker' in navigator) {

  // registration of SW

  // window.addEventListener('load', () => {
  //   navigator.serviceWorker.register('/sw.js').then(registration => {
  //     console.log('SW registered: ', registration);
  //   }).catch(registrationError => {
  //     console.log('SW registration failed: ', registrationError);
  //   });
  // });


  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
     registration.unregister()
   } })
}