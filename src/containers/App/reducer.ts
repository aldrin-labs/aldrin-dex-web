import { createReducer } from 'redux-act'

// Use App containers as initialState for reusable parts

const initialState = {
  theme: 'dark',
  portfolio: {
    drawer: false
  }
}

export default createReducer({
}, initialState)
