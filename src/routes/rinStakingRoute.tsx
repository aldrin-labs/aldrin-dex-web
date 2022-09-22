import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

// import MaintenancePage from './plutoniansStakingRoute'

import { RinStaking } from '@sb/compositions/RinStaking/index'

export default function RinStakingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={RinStaking} />
    </Switch>
  )
}
