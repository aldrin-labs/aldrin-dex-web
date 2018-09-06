import { ActionsObservable, combineEpics, Epic } from 'redux-observable'
import 'rxjs'

import { test, testNext } from '@containers/Screener/actions'

export const testEpic = (action$: any) =>
  action$.ofType(testNext)
    .delay(1000) // Asynchronously wait 1000ms then continue
    .mapTo({ type: test });
