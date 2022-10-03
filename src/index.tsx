import React, { Suspense, lazy } from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { SWRConfig } from 'swr'

import { ErrorBoundary, Loading } from '@sb/components/index'
import { App } from '@sb/compositions/App/'

import { client } from '@core/graphql/apolloClient'
import { MASTER_BUILD } from '@core/utils/config'

import { GlobalStyle } from './index.styles'

const TechIssues = lazy(
  () => import(/* webpackPrefetch: true, webpackChunkName: "techIssuesRoute" */ '@routes/techIssuesRoute')
)

const ChartRoutes = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "chart" */ '@routes/chartRoute'))
const NotFound = lazy(() => import(/* webpackChunkName: "notFound" */ '@sb/components/NotFound'))

// const UnderMaintenance = lazy(
//   () => import(/* webpackPrefetch: true, webpackChunkName: "underMaintenance"  */ '@sb/components/UnderMaintenance')
// )

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
const AnalyticsRoute = lazy(() => import(/* webpackChunkName: "analytics" */ '@routes/analyticsRoute'))
const RestrictedRegionRoute = lazy(() => import(/* webpackChunkName: "rewards" */ '@routes/restrictedRegionRoute'))

const AddressbookRoute = lazy(() => import(/* webpackChunkName: "addressbook" */ '@routes/addressRoute'))

const PoolsRoute = lazy(() => import(/* webpackChunkName: "pools" */ '@routes/poolsRoute'))

const RebalanceRoute = lazy(() => import(/* webpackChunkName: "rebalance" */ '@routes/rebalanceRoute'))
const SwapRoutes = lazy(() => import(/* webpackChunkName: "swap" */ '@routes/swapRoute'))

const DashboardRoute = lazy(() => import(/* webpackChunkName: "dashboard" */ '@routes/dashboardRoute'))

const StakingRoute = lazy(() => import(/* webpackChunkName: "staking" */ '@routes/stakingRoute'))

const TwammRoute = lazy(() => import(/* webpackChunkName: "rebalance" */ '@routes/twammRoute'))

const RinStakingRoute = lazy(() => import(/* webpackChunkName: "rinStaking" */ '@routes/rinStakingRoute'))

const MarinadeStakingRoute = lazy(
  () => import(/* webpackChunkName: "marinadeStaking" */ '@routes/marinadeStakingRoute')
)

const PlutoniansStakingRoute = lazy(
  () => import(/* webpackChunkName: "plutoniansStaking" */ '@routes/plutoniansStakingRoute')
)

const MigrationToolRoute = lazy(() => import(/* webpackChunkName: "migrationTool" */ '@routes/migrationToolRoute'))

const UserInfoRoute = lazy(() => import(/* webpackChunkName: "userInfo" */ '@routes/userInfoRoute'))

// const HomepageRoute = lazy(() => import('@routes/homeRoute'))

const isSafari =
  /Safari/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)

const SWR_CONFIG = {
  revalidateOnFocus: false,
}

const AppRoot = () => (
  <ApolloProvider client={client}>
    <GlobalStyle />
    <BrowserRouter>
      <App>
        {/* <WaningBanner bannerId="solana19upgrade">
          Due to some issues with RPC nodes providers Solana dApps may experience outages. Funds are safe.
        </WaningBanner> */}
        <ErrorBoundary>
          <SWRConfig value={SWR_CONFIG}>
            <Suspense fallback={<Loading centerAligned />}>
              <Switch>
                {isSafari && (
                  <>
                    {' '}
                    <Redirect from="*" to="/chart" exact /> <Route path="*" component={TechIssues} />
                  </>
                )}
                <Redirect from="/" to="/swap" exact />
                <Redirect from="/chart" to="/chart/spot" exact />
                <Redirect from="/chart/spot" to="/chart/spot/RIN_USDC" exact />
                <Redirect from="/chart/spot/CCAI_USDC" to="/chart/spot/RIN_USDC" exact />
                <Redirect from="/chart/futures" to="/chart/spot/RIN_USDC" />
                <Redirect from="/analytics" to="/analytics/all" exact />
                <Redirect from="/rewards" to="/" exact />

                {/* <Route exact path="/" component={HomeRoutes} /> */}
                {/* <Route path="/profile" component={ProfileRoutes} /> */}
                {/* <Route path="/portfolio" component={PortfolioRoutes} /> */}
                {/* {<Route exact path="/market" component={MarketRoutes} />} */}
                {/* <Route path="/" component={HomepageRoute} exact /> */}
                <Route path="/chart" component={ChartRoutes} />
                <Route path="/analytics" component={AnalyticsRoute} />
                <Route path="/dashboard" component={DashboardRoute} />

                <Redirect from="/staking/plutonians" to="/staking/plutonians/PLD" exact />
                <Route path="/staking/plutonians/:symbol" component={PlutoniansStakingRoute} exact />
                <Route path="/staking/marinade" component={MarinadeStakingRoute} />
                <Route path="/staking/rin" component={RinStakingRoute} />
                <Route path="/staking" component={StakingRoute} />

                {!MASTER_BUILD && <Route path="/addressbook" component={AddressbookRoute} />}
                <Route path="/pools" component={PoolsRoute} />

                <Route path="/rebalance" component={RebalanceRoute} exact />
                <Route path="/restrictedRegion" component={RestrictedRegionRoute} exact />

                <Route path="/swap" component={SwapRoutes} />
                <Route path="/restrictedRegion" component={RestrictedRegionRoute} exact />
                <Route path="/dtwap" component={TwammRoute} exact />
                <Route path="/migrationTool" component={MigrationToolRoute} exact />
                <Route path="/userInfo" component={UserInfoRoute} exact />
                {/* <Route exact path="/screener" component={ScreenerRoutes} />x */}
                {/* <Route exact path="/user" component={UserRoutes} /> */}
                {/* <Route exact path="/tech_issues" component={TechIssues} /> */}
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </SWRConfig>
        </ErrorBoundary>
      </App>
    </BrowserRouter>
  </ApolloProvider>
)

const R = hot(AppRoot)
ReactDOM.render(<R />, document.getElementById('root'))

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
