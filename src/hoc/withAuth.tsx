import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import YouNeedToLoginMessage from '@components/YouNotLoginedCard'
import { Grow } from '@material-ui/core'

const Result = (Component: React.ComponentType) => ({
  login,
  openMessage,
  ...props
}: {
  login: boolean
  openMessage: boolean
}) => {
  if (!login) {
    return (
      <Grow in={!openMessage} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <YouNeedToLoginMessage showModalAfterDelay={1500} />
        </div>
      </Grow>
    )
  }

  return <Component {...props} />
}

const mapStateToProps = (store: any) => ({
  login: store.login.loginStatus,
  openMessage: store.login.modalIsOpen,
})

export default compose(
  connect(mapStateToProps),
  Result
)
