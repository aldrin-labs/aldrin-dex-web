import { Observable } from 'rxjs/Observable'
import * as actions from './actions'
import { graphql } from 'react-apollo'
import * as API from './components/SelectAccount/api'

function updateSelectedAccounts({ payload }: any) {
  return {
    type: actions.updateSelectedAccounts.getType(),
    payload
  }
}

function mergeAllKeys({ payload }: any) {
  return {
    type: actions.mergeAllKeys.getType(),
    payload
  }
}

export const onLoad = (action$: any) =>
  action$.ofType(actions.onLoad.getType())
    .switchMap(async (test) => {
      const yoba = await graphql(API.getKeys)
      console.log(yoba)
    }).map(item => { console.log(8833, item)})

export const selectAllKeys = (action$) =>
    action$.ofType(actions.selectAllKeys.getType())
    .map(mergeAllKeys)

export const selectAccount = (action$: any) =>
  action$.ofType(actions.selectAccount.getType())
    .map(updateSelectedAccounts)

export const getPortfolio = (action$): any => {
  return action$.ofType(actions.getPortfolio.getType())
    .mapTo(({ payload }) => ({ type: actions.getPortfolio.getType(), payload }))
}
