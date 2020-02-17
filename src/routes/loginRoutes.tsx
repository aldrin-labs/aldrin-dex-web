import * as React from 'react'
import { Route, Switch, match } from 'react-router-dom'
import Login from '@sb/compositions/Login/Login'

export default ({ match, location }: { match: match; location: Location }) => (
  <Switch>
    <Route
      exact
      path="/signin"
      render={(...rest) => {
        console.log('/signin')
        return <Login initialStep={'signIn'} />
      }}
    />
    <Route
      exact
      path="/signup"
      render={(...rest) => {
        console.log('/signup')
        return <Login initialStep={'signUp'} />
      }}
    />
    <Route
      exact
      path="/login"
      render={(...rest) => {
        console.log('/login')
        return <Login />
      }}
    />
  </Switch>
)
