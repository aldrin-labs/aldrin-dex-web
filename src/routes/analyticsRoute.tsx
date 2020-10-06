import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import AnalyticsRoute from '@sb/compositions/AnalyticsRoute/index'

export default function AnalyticsRoutes({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={AnalyticsRoute} />
    </Switch>
  )
}
