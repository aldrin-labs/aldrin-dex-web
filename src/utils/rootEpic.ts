import { combineEpics, Epic } from 'redux-observable'

import ScreenerEpics from '@containers/Screener/epics'
import UserEpics from '@containers/User/epics'
import * as loginEpics from '@containers/Login/epics'

export default combineEpics(
  ScreenerEpics,
  UserEpics,
  ...Object.values(loginEpics),
)
