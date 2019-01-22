import React from 'react'
import { compose } from 'redux'
import { Mutation, Query } from 'react-apollo'

import YouNeedToLoginMessage from '@storybook/components/YouNotLoginedCard'
import { UPDATE_LOGIN_POPUP_APPEARED } from '@core/graphql/mutations/ui/updateLoginPopupAppeared'
import { LOGIN_POPUP_APPEARED } from '@core/graphql/queries/ui/LOGIN_POPUP_APPEARED'
import { GET_LOGIN_DATA } from '@core/graphql/queries/login/GET_LOGIN_DATA'
// TODO: add hooks or better handling for queries



const Result = (Component: React.ComponentType) => ({
  ...props
}: {
}) => {
  return (
    <Query query={GET_LOGIN_DATA}>
      {({
          // TODO: Replace with apollo-hooks
          loading, data, error,
        }) => {
        if (loading) return 'Loading...'
        if (error) return `Error!`

        const loginStatus = data.login.loginStatus
        const modalIsOpen = data.login.modalIsOpen


        if (!loginStatus) {
          return (
            <Mutation mutation={UPDATE_LOGIN_POPUP_APPEARED}>
              {(updateLoginPopupAppeared) => (
                <Query query={LOGIN_POPUP_APPEARED}>
                  {({
                    // data: {
                    //   ui: { logInPopupAppeared },
                    // },
                    loading, data, error,
                  }) => {
                    if (loading) return 'Loading...'
                    if (error) return `Error!`

                    const logInPopupAppeared = data.ui.logInPopupAppeared

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

export default compose()(Result)
