import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import YouNeedToLoginMessage from '@components/YouNotLoginedCard'
import { graphql, Mutation, Query } from 'react-apollo'
import { UPDATE_LOGIN_POPUP_APPEARED } from '@core/graphql/mutations/ui/updateLoginPopupAppeared'
import { LOGIN_POPUP_APPEARED } from '@core/graphql/queries/ui/LOGIN_POPUP_APPEARED'
import { GET_LOGIN_DATA } from '@core/graphql/queries/login/GET_LOGIN_DATA'

const Result = (Component: React.ComponentType) => ({
  // login,
  // openMessage,
  ...props
}: {
  // login: boolean
  // openMessage: boolean
}) => {
  return (
    <Query query={GET_LOGIN_DATA}>
      {({
        data: {
          login: { loginStatus, modalIsOpen },
        },
      }) => {
        if (!loginStatus) {
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
                        open={!modalIsOpen}
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
      }}
    </Query>
  )
}

// const mapStateToProps = (store: any) => ({
//   login: store.login.loginStatus,
//   openMessage: store.login.modalIsOpen,
// })

export default compose()(Result)
// connect(mapStateToProps),
// graphql(GET_LOGIN_DATA, { name: 'loginDataQuery' }),
