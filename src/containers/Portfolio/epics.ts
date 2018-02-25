import { Observable } from 'rxjs/Observable'
import * as actions from './actions'

export const getPortfolio = (action$): any => {
  return aciton$.ofType(actions.getPortfolio.getType())
    .mapTo(({ payload }) => ({ type: actions.getPortfolio.getType(), payload }))
}
