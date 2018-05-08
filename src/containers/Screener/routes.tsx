import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Screener } from './Screener'

export default function ScreenerRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={Screener} />
    </Switch>
  )
}
