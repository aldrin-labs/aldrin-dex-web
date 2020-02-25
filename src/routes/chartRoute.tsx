import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Chart from '@sb/compositions/Chart'

export default function ChartRoutes({ match, location }) {
  return (
    <Switch>
      <Route
        exact
        path="/chart/spot"
        render={(...rest) => {
          return <Chart marketType={0} />
        }}
      />
      <Route
        exact
        path="/chart/futures"
        render={(...rest) => {
          return <Chart marketType={1} />
        }}
      />
    </Switch>
  )
}
