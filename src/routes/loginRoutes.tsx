import * as React from 'react'
import { Route, Switch, match } from 'react-router-dom'
import Login from '@sb/compositions/Login/Login'

export default ({ match, location }: { match: match; location: Location }) => (
  <Switch>
    <Route
      exact
      path="/login"
      render={(...rest) => {
        return <Login initialStep={'signIn'} />
      }}
    />
    <Route
      exact
      path="/signup"
      render={(...rest) => {
        return <Login initialStep={'signUp'} />
      }}
    />
  </Switch>
)
