import gql from 'graphql-tag'

export const LOGIN_POPUP_APPEARED = gql`
  query LOGIN_POPUP_APPEARED {
    ui @client {
      logInPopupAppeared
    }
  }
`
