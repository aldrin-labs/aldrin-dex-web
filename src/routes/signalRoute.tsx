import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import SignalPage from '@sb/compositions/Signal/SignalPage'

export default function SignalRoutes({ match, location }) {
    return (
        <Switch>
            <Route path={match.url} component={SignalPage} />
        </Switch>
    )
}
