import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import SwapPage from '@sb/compositions/Swap/index'

export default function SwapRoutes({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={SwapPage} />
    </Switch>
  )
}
