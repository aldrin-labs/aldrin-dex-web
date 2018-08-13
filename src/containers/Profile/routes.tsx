import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Profile from '@containers/Profile/Profile'

export default function ProfileRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={Profile} />
      <Route path={`${match.url}:id`} component={Profile} />
    </Switch>
  )
}
