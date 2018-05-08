import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Portfolio from './Portfolio'

export default function PortfolioRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={Portfolio} />
    </Switch>
  )
}
