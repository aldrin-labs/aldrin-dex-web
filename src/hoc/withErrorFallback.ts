import { omit } from 'ramda'
import {
  compose,
  withState,
  branch,
  mapProps,
  renderComponent,
  setDisplayName,
  lifecycle,
} from 'recompose'

import { ErrorFallback } from '@common/ErrorFallback'

export const withErrorFallback = compose(
  setDisplayName('ErrorBoundry'),
  withState('hasError', 'setHasError', false),
  withState('errorInfo', 'setErrorInfo', ''),
  lifecycle({
    componentDidCatch(error: any, errorInfo: any) {
      this.props.setHasError(true)
      this.props.setErrorInfo(errorInfo)
      console.log(error, errorInfo)
    }
  }),
  branch((props) => props.hasError, renderComponent(ErrorFallback)),
  compose(mapProps, omit)(['hasError', 'setHasError'])
)
