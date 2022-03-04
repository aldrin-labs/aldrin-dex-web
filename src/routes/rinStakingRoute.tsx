import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { RinStaking } from '@sb/compositions/RinStaking'

export default function RinStakingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={RinStaking} />
    </Switch>
  )
}
