import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Chart from '@containers/Chart/Chart'

export default function ChartRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={Chart} />
    </Switch>
  )
}
