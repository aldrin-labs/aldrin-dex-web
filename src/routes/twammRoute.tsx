import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { TwammComponent } from '@sb/compositions/Twamm/index'

export default function TwammRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={TwammComponent} />
    </Switch>
  )
}
