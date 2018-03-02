import { branch, renderComponent } from 'recompose'

import { Loading } from '@common/Loading'

export const LoaderHOC = (component: any, propName = 'data') =>
  branch(
    (props: any) => props[propName] && props[propName].loading,
    renderComponent(component ? component : Loading)
  )
