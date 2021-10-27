import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { StakingMock } from '@sb/components/StakingMock'

export default function StakingRoute ({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={StakingMock} />
    </Switch>
  )
}
