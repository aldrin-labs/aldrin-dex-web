import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Dashboard from '@sb/compositions/Dashboard/Dashboard'

export default function DashboardRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={Dashboard} />
    </Switch>
  )
}
