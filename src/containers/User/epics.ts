import { Observable } from 'rxjs/Observable'
import * as actions from '@containers/User/actions'

export const testEpic = (action$: any) =>
  action$.ofType(actions.addExchangeKey.getType())
    .delay(1000) // Asynchronously wait 1000ms then continue
    .mapTo({ type: actions.testUser, payload: 'test!' });
