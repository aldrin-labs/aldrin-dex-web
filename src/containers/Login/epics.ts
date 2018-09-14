import * as actions from '@containers/Login/actions'

function storeLogin(profile: any) {
  return {
    type: actions.storeLogin,
    payload: profile,
  }
}
