import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { PlutoniansStaking } from '@sb/compositions/PlutoniansStaking/PlutoniansStaking'

export default function PlutoniansStakingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={PlutoniansStaking} />
    </Switch>
  )
}
