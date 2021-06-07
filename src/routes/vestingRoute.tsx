import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Vesting } from '@sb/compositions/Vesting/index'

export default function VestingRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={Vesting} />
    </Switch>
  )
}
