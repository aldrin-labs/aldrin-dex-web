import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import RewardsRoute from '@sb/compositions/Rewards/index'

export default function RewardsRoutes({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={RewardsRoute} />
    </Switch>
  )
}
