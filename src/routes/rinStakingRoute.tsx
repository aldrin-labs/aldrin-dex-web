import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

<<<<<<< HEAD
import { RinStaking } from '@sb/compositions/RinStaking/index'
=======
import { Staking } from '@sb/compositions/RinStaking'
>>>>>>> b2f4557ab (Bump)

export default function RinStakingRoute({ match }) {
  return (
    <Switch>
<<<<<<< HEAD
      <Route path={match.url} component={RinStaking} />
=======
      <Route path={match.url} component={Staking} />
>>>>>>> b2f4557ab (Bump)
    </Switch>
  )
}
