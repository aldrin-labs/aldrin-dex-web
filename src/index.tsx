import React, { Suspense, lazy, useState } from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { App } from '@sb/compositions/App/'
import { client } from '@core/graphql/apolloClient'
import { ErrorBoundary } from '@sb/components/index'
import { Loading } from '@sb/components'
import { MASTER_BUILD } from '@core/utils/config'
import { GlobalStyle } from './index.styles'

const TechIssues = lazy(() =>
  import(
    /* webpackPrefetch: true, webpackChunkName: "techIssuesRoute" */ '@routes/techIssuesRoute'
  )
)
const ChartRoutes = lazy(() =>
  import(
    /* webpackPrefetch: true, webpackChunkName: "chart" */ '@routes/chartRoute'
  )
)
const NotFound = lazy(() =>
  import(/* webpackChunkName: "notFound" */ '@sb/components/NotFound')
)

const UnderMaintenance = lazy(() =>
  import(
    /* webpackPrefetch: true, webpackChunkName: "underMaintenance"  */ '@sb/components/UnderMaintenance'
  )
)
// const PortfolioRoutes = lazy(() =>
//   import(/* webpackChunkName: "portfolio" */ '@routes/portfolioRoute')
// )
// const ProfileRoutes = lazy(() =>
//   import(/* webpackChunkName: "profile" */ '@routes/profileRoute')
// )
// const UserRoutes = lazy(() =>
//   import(/* webpackChunkName: "user" */ '@routes/userRoute')
// )
// const MarketRoutes = lazy(() =>
//   import(/* webpackChunkName: "market" */ '@routes/coinMarketCapRoute')
// )
// const SignalRoutes = lazy(() =>
//   import(/* webpackChunkName: "signal" */ '@routes/signalRoute')
// )
// const OnboardingRoutes = lazy(() =>
//   import(/* webpackChunkName: "onboarding" */ '@routes/onboardingRoute')
// )
// const LoginRoutes = lazy(() =>
//   import(/* webpackChunkName: "login" */ '@routes/loginRoutes')
// )
const AnalyticsRoute = lazy(() =>
  import(/* webpackChunkName: "analytics" */ '@routes/analyticsRoute')
)
const RestrictedRegionRoute = lazy(() =>
  import(/* webpackChunkName: "rewards" */ '@routes/restrictedRegionRoute')
)

const AddressbookRoute = lazy(() =>
  import(/* webpackChunkName: "addressbook" */ '@routes/addressRoute')
)

const PoolsRoute = lazy(() =>
  import(/* webpackChunkName: "pools" */ '@routes/poolsRoute')
)

const RebalanceRoute = lazy(() =>
  import(/* webpackChunkName: "rebalance" */ '@routes/rebalanceRoute')
)
const SwapRoutes = lazy(() =>
  import(/* webpackChunkName: "swap" */ '@routes/swapRoute')
)

const DashboardRoute = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ '@routes/dashboardRoute')
)

const StakingRoute = lazy(() =>
  import(/* webpackChunkName: "staking" */ '@routes/stakingRoute')
)

// const HomepageRoute = lazy(() => import('@routes/homeRoute'))

const isSafari =
  /Safari/.test(navigator.userAgent) &&
  !/CriOS/.test(navigator.userAgent) &&
  !/Chrome/.test(navigator.userAgent)


const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <GlobalStyle />
      <BrowserRouter>
        <App>
          <ErrorBoundary>
            <Suspense fallback={<Loading centerAligned />}>
              <Switch>
                {isSafari && (
                  <>
                    {' '}
                    <Redirect from="*" to="/chart" exact />{' '}
                    <Route path="*" component={TechIssues} />
                  </>
                )}
                <Redirect from="/" to={'/chart'} exact />
                <Redirect from="/chart" to="/chart/spot" exact />
                <Redirect from="/chart/spot" to="/chart/spot/RIN_USDC" exact />
                <Redirect
                  from="/chart/spot/CCAI_USDC"
                  to="/chart/spot/RIN_USDC"
                  exact
                />
                <Redirect from="/chart/futures" to="/chart/spot/RIN_USDC" />
                <Redirect from="/analytics" to="/analytics/all" exact />
                <Redirect from="/rewards" to="/" exact />

                {/*<Route exact path="/" component={HomeRoutes} />*/}
                {/* <Route path="/profile" component={ProfileRoutes} /> */}
                {/* <Route path="/portfolio" component={PortfolioRoutes} /> */}
                {/* {<Route exact path="/market" component={MarketRoutes} />} */}
                {/* {<Route exact path="/signals" component={SignalRoutes} />} */}
                {/* <Route path="/" component={HomepageRoute} exact /> */}
                <Route path="/chart" component={ChartRoutes} />
                <Route path="/analytics" component={AnalyticsRoute} />
                <Route path="/dashboard" component={DashboardRoute} />
                <Route path="/staking" component={StakingRoute} />
                {!MASTER_BUILD && (
                  <Route path="/addressbook" component={AddressbookRoute} />
                )}
                <Route path="/pools" component={PoolsRoute} />
                <Route path="/staking" component={StakingRoute} />

                <Route path="/rebalance" component={RebalanceRoute} exact />
                <Route
                  path="/restrictedRegion"
                  component={RestrictedRegionRoute}
                  exact
                />

                <Route path="/swap" component={SwapRoutes} />
                <Route
                  path="/restrictedRegion"
                  component={RestrictedRegionRoute}
                  exact
                />
                {/*<Route exact path="/screener" component={ScreenerRoutes} />x*/}
                {/* <Route exact path="/user" component={UserRoutes} /> */}
                {/* <Route exact path="/tech_issues" component={TechIssues} /> */}
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </ErrorBoundary>
        </App>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
  )

render(hot(module)(App))

// if ('serviceWorker' in navigator) {
//   console.log('serviceWorker in navigator')

//   // registration of SW
//   // window.addEventListener('load', () => {
//   //   navigator.serviceWorker
//   //     .register('/sw.js')
//   //     .then((registration) => {
//   //       console.log('SW registered: ', registration)
//   //     })
//   //     .catch((registrationError) => {
//   //       console.log('SW registration failed: ', registrationError)
//   //     })
//   // })

//   // Unregister of SW
//   window.addEventListener('load', () => {
//     console.log('window load')

//     navigator.serviceWorker.getRegistrations()
//     .then( (registrations) => {
//       console.log('SW registrations: ', registrations)
//       for (let registration of registrations) {
//         console.log('SW registration: ', registration)
//         registration.unregister()
//       }
//     })
//     .catch( (err) => {
//       console.log('SW registration failed: ', err);
//     });
//   })
// }
