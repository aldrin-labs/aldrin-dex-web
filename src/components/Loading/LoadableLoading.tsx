import * as React from 'react'
import { Loading } from './Loading'

export default class LoadableLoading extends React.Component {
  render() {
    const { error, timedOut, pastDelay } = this.props
    if (error) {
      // When the loader has errored
      return <div>Error!</div>
    } else if (timedOut) {
      // When the loader has taken longer than the timeout
      return <div>Taking a long time...</div>
    } else if (pastDelay) {
      // When the loader has taken longer than the delay
      return <Loading />
    } else {
      // When the loader has just started
      return null
    }
  }
}
