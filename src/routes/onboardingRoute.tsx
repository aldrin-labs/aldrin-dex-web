import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Onboarding from '@sb/compositions/Onboarding'

import Auth from '@sb/compositions/Onboarding/Auth'
const auth = new Auth()

export default function PortfolioRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} exact component={() => <Onboarding step="first" auth={auth}/>} />
      <Route path={`${match.url}/confirm`} component={() => <Onboarding step="second" auth={auth}/>} />
    </Switch>
  )
}
