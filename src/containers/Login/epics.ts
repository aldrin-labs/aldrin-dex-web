import { Observable } from 'rxjs/Observable'
import * as actions from './actions'

export const storeLogin = (action$): any => {
  return action$.ofType(actions.storeLogin.getType())
      .mapTo(({ payload }: any) => ({ type: actions.storeLogin.getType(), payload }))
}
