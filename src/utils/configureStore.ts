import rootEpic from '@utils/rootEpic'
import rootReducer from '@utils/rootReducer'

import Immutable from 'immutable'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createEpicMiddleware } from 'redux-observable'
import { autoRehydrate, persistStore } from 'redux-persist-immutable' // TODO: write types

const epicMiddleware = createEpicMiddleware(rootEpic)

const initialState = Immutable.Map({});
const middlewares = [epicMiddleware]

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares), autoRehydrate())
)

export default persistStore(store, {})
