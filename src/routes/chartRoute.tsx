import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Chart from '@sb/compositions/Chart'

export default function ChartRoutes() {
  return (
    <Switch>
      <Route
        exact
        path="/chart/spot/:selectedPair"
        render={({ match: { params } }) => <Chart marketType={0} selectedPair={params.selectedPair} />}
      />
      <Route
        exact
        path="/chart/futures/:selectedPair"
        render={({ match: { params } }) => <Chart marketType={1} selectedPair={params.selectedPair} />}
      />
    </Switch>
  )
}
