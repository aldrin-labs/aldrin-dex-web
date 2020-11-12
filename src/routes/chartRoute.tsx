import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Chart from '@sb/compositions/Chart'

export default function ChartRoutes({ match, location, ...other }) {
  return (
    <Switch>
      <Route
        path="/chart/spot"
        render={({ match: { params } }) => {
          return <Chart marketType={0} selectedPair={params.selectedPair} />
        }}
      />
      <Route
        path="/chart/futures"
        render={({ match: { params } }) => {
          return <Chart marketType={1} selectedPair={params.selectedPair} />
        }}
      />
    </Switch>
  )
}
