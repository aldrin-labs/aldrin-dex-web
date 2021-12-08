import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import BorrowLendingPage from '@sb/compositions/BorrowLending/index'
import BorrowLendingMarkets from '@sb/compositions/BorrowLending/Markets/Markets'

export default function BorrowLendingRoutes({ match }) {
    return (
        <Switch>
            <Route exact path={`${match.url}/markets`} component={BorrowLendingMarkets} />
            <Route exact path={match.url} component={BorrowLendingPage} />
        </Switch>
    )
}
