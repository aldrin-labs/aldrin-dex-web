import { createReducer } from 'redux-act'

const initialState = {
  theme: 'dark',
  portfolio: {
    drawer: false
  }
}

export default createReducer({
}, initialState)
