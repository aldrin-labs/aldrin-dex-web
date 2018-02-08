import { combineEpics, Epic } from 'redux-observable'

import ScreenerEpics from '@containers/Screener/epics'

export default combineEpics(
  ScreenerEpics
)
