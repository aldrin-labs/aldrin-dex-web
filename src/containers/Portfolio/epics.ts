import { Observable } from 'rxjs/Observable'
import * as actions from './actions'
import { graphql } from 'react-apollo'
import * as API from './api'

function updateSelectedAccounts({ payload }: any) {
  return {
    type: actions.updateSelectedAccounts.getType(),
    payload,
  }
}

function mergeAllKeys({ payload }: any) {
  return {
    type: actions.mergeAllKeys.getType(),
    payload,
  }
}

export const selectAllKeys = action$ =>
  action$.ofType(actions.selectAllKeys.getType()).map(mergeAllKeys)

export const selectAccount = (action$: any) =>
  action$.ofType(actions.selectAccount.getType()).map(updateSelectedAccounts)

