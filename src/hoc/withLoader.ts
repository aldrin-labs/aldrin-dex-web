import { branch, renderComponent } from 'recompose'

import { Loading } from '@common/Loading'

export const withLoader: any = (component?: any, propName = 'data'): any =>
  branch(
    (props: any) => props[propName] && props[propName].loading,
    renderComponent(component ? component : Loading)
  )
