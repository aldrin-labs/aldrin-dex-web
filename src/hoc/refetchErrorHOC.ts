import { withProps } from 'recompose'

export const refetchErrorHOC = (propName = 'data') =>
  withProps((props: any) => ({ refetch: props[propName] && props[propName].data }))
