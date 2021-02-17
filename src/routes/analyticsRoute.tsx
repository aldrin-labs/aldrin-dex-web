import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import AnalyticsRoute from '@sb/compositions/AnalyticsRoute/index'

export default function AnalyticsRoutes({ match }) {
  console.log('match', match)
  return (
    <Switch>
      <Route
        path="/analytics/:selectedPair"
        render={({ match: { params } }) => {
          return <AnalyticsRoute selectedPair={params.selectedPair} />
        }}
      />
    </Switch>
  )
}
