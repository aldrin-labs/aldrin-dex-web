import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { MarinadeStaking } from '@sb/compositions/MarinadeStaking/index'

export default function MarinadeStakingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={MarinadeStaking} />
    </Switch>
  )
}
