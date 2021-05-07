import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import RestrictedRegion from '@sb/compositions/RestrictedRegion'

export default function RestrictedRegionRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={RestrictedRegion} />
    </Switch>
  )
}
