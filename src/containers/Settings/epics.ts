import { Observable } from 'rxjs/Observable'
import * as actions from './actions'

const logAddTodo = (action$): any => {
  return action$.ofType(actions.addExchangeKey.getType())
      .mapTo({ type: actions.addExchangeKey.getType(), payload: 'nothing' })
}

export default logAddTodo
