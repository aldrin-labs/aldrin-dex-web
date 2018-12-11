import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { MyCoinMarket } from '@containers/CoinMarketCap/index'


export default function MarketRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={MyCoinMarket} />
    </Switch>
  )
}
