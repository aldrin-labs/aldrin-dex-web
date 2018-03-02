import { Observable } from 'rxjs/Observable'
import * as actions from './actions'

function updateSelectedAccounts({ payload }: any) {
  return {
    type: actions.updateSelectedAccounts.getType(),
    payload
  }
}

export const selectAccount = (action$: any) =>
  action$.ofType(actions.selectAccount.getType())
    .map(updateSelectedAccounts)

export const getPortfolio = (action$): any => {
  return action$.ofType(actions.getPortfolio.getType())
    .mapTo(({ payload }) => ({ type: actions.getPortfolio.getType(), payload }))
}
