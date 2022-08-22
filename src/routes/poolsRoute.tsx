import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { PoolsComponent } from '@sb/compositions/Pools'

export default function PoolsRoutes({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={PoolsComponent} />
    </Switch>
  )
}
