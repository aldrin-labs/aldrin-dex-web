import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import CoinMarket from './CoinMarketCap'

export default function MarketRoutes({ match, location }) {
  return (
    <Switch>
      <Route path={match.url} component={CoinMarket} />
    </Switch>
  )
}
