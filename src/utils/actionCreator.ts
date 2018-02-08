import { createAction } from 'redux-act'

export const createDeferredAction = (actionName: string, payloadCreator: any) => {
  const action = createAction(`${actionName}/request`, payloadCreator)
  action.error = createAction(`${actionName}/error`)
  action.success = createAction(`${actionName}/success`)
  action.cancel = createAction(`${actionName}/cancel`)
  action.notFound = createAction(`${actionName}/notFound`)

  return action
}
