import { ActionsObservable, combineEpics, Epic } from 'redux-observable'
import 'rxjs'

const testEpic: Epic<any, any> = (action$: ActionsObservable<any>) =>
  action$.filter((action: any) => action.type === 'inc!')
  .delay(500)
  .mapTo('add')

export default combineEpics(
  testEpic
)
