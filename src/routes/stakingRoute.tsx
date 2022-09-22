import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { MaintenancePage } from '@sb/compositions/StakingV2/components/MaintenancePage'

// import { StakingPage } from '@sb/compositions/Staking'

export default function StakingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={MaintenancePage} />
    </Switch>
  )
}
