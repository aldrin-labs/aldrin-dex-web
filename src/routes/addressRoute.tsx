import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import AddressbookRoute from '@sb/compositions/Addressbook/index'

export default function AddressbookRoutes({ match }) {
  return (
    <Switch>
      <Route path={match.url} component={AddressbookRoute} />
    </Switch>
  )
}
