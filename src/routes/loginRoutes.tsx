import * as React from 'react'
import { Route, Switch, match } from 'react-router-dom'
import Login from '@sb/compositions/Login/Login'

export default ({ match, location }: { match: match; location: Location }) => (
  <Switch>
    <Route exact path="/login" render={(...rest) => <Login initialStep="signIn" />} />
    <Route exact path="/signup" render={(...rest) => <Login initialStep="signUp" />} />
  </Switch>
)
