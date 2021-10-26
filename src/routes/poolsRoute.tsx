import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { LiquidityPoolsMock } from '@sb/compositions/Pools/components/MockedScreen/LiquidityPoolsMock'

export default function PoolsRoutes({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={LiquidityPoolsMock} />
    </Switch>
  )
}
