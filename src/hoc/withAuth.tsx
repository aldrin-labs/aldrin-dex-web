import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import YouNeedToLoginMessage from '@components/YouNotLoginedCard'

const Result = (Component: React.ComponentType) => ({
  login,
  ...props
}: {
  login: boolean
}) => {
  if (!login) {
    return <YouNeedToLoginMessage showModalAfterDelay={1500} />
  }

  return <Component {...props} />
}

const mapStateToProps = (store: any) => ({
  login: store.login.loginStatus,
})

export default compose(
  connect(mapStateToProps),
  Result
)
