import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

// import { MarinadeStaking } from '@sb/compositions/MarinadeStaking'
import { MaintenancePage } from '@sb/compositions/StakingV2/components/MaintenancePage'

export default function MarinadeStakingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={MaintenancePage} />
    </Switch>
  )
}
