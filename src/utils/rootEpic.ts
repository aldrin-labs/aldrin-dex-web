import { combineEpics, Epic } from 'redux-observable'

import * as ScreenerEpics from '@containers/Screener/epics'


export default function createRootEpics() {
  return combineEpics(
    ...ScreenerEpics
  )
}
