import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import TechIssues from '@sb/compositions/TechIssues/index'

export default function TechIssuesRoute({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={TechIssues} />
    </Switch>
  )
}
