import { Observable } from 'rxjs/Observable'
import * as actions from './actions'

export const testEpic = (action$: any) =>
  action$.ofType(actions.addExchangeKey.getType())
    .delay(1000) // Asynchronously wait 1000ms then continue
    .mapTo({ type: actions.test, payload: 'test!' });
