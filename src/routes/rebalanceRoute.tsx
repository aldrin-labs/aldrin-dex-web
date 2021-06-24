import * as React from 'react'
import { Route, Switch, match } from 'react-router-dom'
import RebalanceComposition from '@sb/compositions/Rebalance/Rebalance'

export default function RebalanceRoute({ match }: { match: match }) {
  return (
    <Switch>
      <Route path={match.url} component={RebalanceComposition} />
    </Switch>
  )
}
