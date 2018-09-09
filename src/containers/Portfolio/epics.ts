import * as actions from '@containers/Portfolio/actions'
import { graphql } from 'react-apollo'
import * as API from '@containers/Portfolio/api'

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
