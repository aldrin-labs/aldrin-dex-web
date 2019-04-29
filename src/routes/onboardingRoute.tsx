import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Onboarding from '@sb/compositions/Onboarding'

export default function PortfolioRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={Onboarding} />
    </Switch>
  )
}
