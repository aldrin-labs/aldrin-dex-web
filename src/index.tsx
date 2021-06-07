import React, { Suspense, lazy } from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { App } from '@sb/compositions/App/'
import { client } from '@core/graphql/apolloClient'
import { ErrorBoundary } from '@sb/components/index'
import { Loading } from '@sb/components'
import VestingPage from '@sb/compositions/Vesting/index'

import { MASTER_BUILD } from '@core/utils/config'

const NotFound = lazy(() =>
  import(/* webpackChunkName: "notFound" */ '@sb/components/NotFound')
)

const render = () =>
  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App>
          <ErrorBoundary>
            <Suspense fallback={<Loading centerAligned />}>
              <Switch>
                <Route path="/" component={VestingPage} exact />
                <Route component={VestingPage} />
              </Switch>
            </Suspense>
          </ErrorBoundary>
        </App>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
  )

render(hot(module)(App))

if ('serviceWorker' in navigator) {
  // registration of SW

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })

  // navigator.serviceWorker.getRegistrations().then(function(registrations) {
  //   for(let registration of registrations) {
  //    registration.unregister()
  //  } })
}
