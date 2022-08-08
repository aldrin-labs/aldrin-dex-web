import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { MigrationTool } from '@sb/compositions/MigrationTool'

export default function MigrationToolRoute({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={MigrationTool} />
    </Switch>
  )
}
