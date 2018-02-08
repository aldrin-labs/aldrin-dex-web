import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'


import rootEpic from '@utils/rootEpic'
import rootReducer from '@utils/rootReducer'

const epicMiddleware = createEpicMiddleware(rootEpic)

export default createStore(
  rootReducer,
  applyMiddleware(
    epicMiddleware
  )
)

