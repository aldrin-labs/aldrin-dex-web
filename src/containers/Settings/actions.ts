import { createAction } from 'redux-act'
import { createActionAsync } from 'redux-act-async'

async function fetchData() {
  await fetch('http://pokeapi.co/api/v2/pokemon/1/')
}
export const addExchangeKey = createAction('ADD KEY')
export const simpleFetch = createActionAsync('FETCH_DATA', fetchData)
