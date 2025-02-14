import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { User } from '@sb/compositions/User'

export default function UserRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={User} />
    </Switch>
  )
}
