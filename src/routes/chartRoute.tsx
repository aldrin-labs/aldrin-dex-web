import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Chart from '@sb/compositions/Chart'

export default function ChartRoutes({ match, location, ...other }) {
  return (
    <Switch>
      <Route
        exact
        path="/chart/spot/:selectedPair"
        render={({ match: { params } }) => {
          return <Chart marketType={0} selectedPair={params.selectedPair} />
        }}
      />
      <Route
        exact
        path="/chart/futures/:selectedPair"
        render={({ match: { params } }) => {
          return <Chart marketType={1} selectedPair={params.selectedPair} />
        }}
      />
    </Switch>
  )
}
