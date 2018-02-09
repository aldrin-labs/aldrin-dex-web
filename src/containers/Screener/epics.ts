import { ActionsObservable, combineEpics, Epic } from 'redux-observable'
import 'rxjs'

import { PING, PONG } from './actions'

const pingEpic = (action$: any) =>
  action$.ofType(PING)
    .delay(1000) // Asynchronously wait 1000ms then continue
    .mapTo({ type: PONG });

export default combineEpics(
  pingEpic
)
