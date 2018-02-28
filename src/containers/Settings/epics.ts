import { Observable } from 'rxjs/Observable'
import * as actions from './actions'

export const logAddTodo = (action$): any => {
  return action$.ofType(actions.addExchangeKey.getType())
      .mapTo({ type: actions.addExchangeKey.getType(), payload: 'nothing' })
}
