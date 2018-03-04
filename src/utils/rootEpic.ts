import { combineEpics, Epic } from 'redux-observable'

import * as screenerEpics from '@containers/Screener/epics'
import * as settingsEpics from '@containers/Settings/epics'
import * as loginEpics from '@containers/Login/epics'
import * as portfolioEpics from '@containers/Portfolio/epics'

export default combineEpics(
  ...Object.values(screenerEpics),
  ...Object.values(settingsEpics),
  ...Object.values(loginEpics),
  ...Object.values(portfolioEpics)
)
