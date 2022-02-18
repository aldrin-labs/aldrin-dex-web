import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { StakingPage } from '@sb/compositions/Staking'

export default function StakingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={StakingPage} />
    </Switch>
  )
}
