import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Staking } from '@sb/compositions/Staking/Staking'

export default function StakingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={Staking} />
    </Switch>
  )
}
