import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { UserInfo } from '@sb/compositions/UserInfo'

export default function UserInfoRoute({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={UserInfo} />
    </Switch>
  )
}
