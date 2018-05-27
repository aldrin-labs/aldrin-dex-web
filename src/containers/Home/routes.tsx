import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '@containers/Home/Home'

export default function HomeRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={Home} />
    </Switch>
  )
}
