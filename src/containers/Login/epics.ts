import { Observable } from 'rxjs/Observable'
import * as actions from './actions'

function storeLogin(profile: any) {
  return {
    type: actions.storeLogin,
    payload: profile,
  }
}

export const lalka = (action$: any) =>
  action$.ofType(actions.onLogin)
  .map(storeLogin)
