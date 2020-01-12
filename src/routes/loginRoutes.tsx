import * as React from 'react'
import { Route, Switch, match } from 'react-router-dom'
import Login from '@sb/compositions/Login/Login'

export default ({ match, location }: { match: match; location: Location }) => (
  <Switch>
    <Route path={match.url} component={Login} />
  </Switch>
)
