import { createSelector } from 'reselect'

const checkSelector = (state: any) => state.user

export const checker = createSelector(
  checkSelector,
  (check) => console.log(check)
)
