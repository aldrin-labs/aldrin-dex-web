import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import YouNeedToLoginMessage from '@components/YouNotLoginedCard'
import { Mutation, Query } from 'react-apollo'
import { UPDATE_LOGIN_POPUP_APPEARED } from '@core/graphql/mutations/ui/updateLoginPopupAppeared'
import { LOGIN_POPUP_APPEARED } from '@core/graphql/queries/ui/LOGIN_POPUP_APPEARED'

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
      <Mutation mutation={UPDATE_LOGIN_POPUP_APPEARED}>
        {(updateLoginPopupAppeared) => (
          <Query query={LOGIN_POPUP_APPEARED}>
            {({
              data: {
                ui: { logInPopupAppeared },
              },
            }) => {
              const render = (
                <YouNeedToLoginMessage
                  open={!openMessage}
                  showModalAfterDelay={logInPopupAppeared ? false : 1500}
                />
              )
              // show login auth0 popup only once
              if (!logInPopupAppeared) {
                updateLoginPopupAppeared()
              }

              return render
            }}
          </Query>
        )}
      </Mutation>
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
