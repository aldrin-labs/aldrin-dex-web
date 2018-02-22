import { combineEpics, Epic } from 'redux-observable'

import ScreenerEpics from '@containers/Screener/epics'
import UserEpics from '@containers/User/epics'

export default combineEpics(
  ScreenerEpics,
  UserEpics
)
