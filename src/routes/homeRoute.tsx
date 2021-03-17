import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Homepage } from '@sb/compositions/Homepage/index'

export default function HomepageRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={Homepage} />
    </Switch>
  )
}
