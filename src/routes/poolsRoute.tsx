import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { PoolsComponent } from '@sb/compositions/Pools/index'

export default function PoolsRoutes({ match }) {
  console.log('match', match)
  return (
    <Switch>
      <Route path={match.url} component={PoolsComponent} />
    </Switch>
  )
}
