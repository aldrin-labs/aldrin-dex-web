import { Observable } from 'rxjs/Observable'
import * as actions from './actions'

const logAddTodo = (action$): any => {
  return action$.ofType(actions.addTodo.getType())
      .mapTo({ type: actions.logTodo.getType(), payload: 'nothing' })
}

export default logAddTodo
