import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import SwapsPage from '@sb/compositions/Swap/index'

export default function SwapsRoutes({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={SwapsPage} />
    </Switch>
  )
}
