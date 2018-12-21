import gql from 'graphql-tag'

export const UPDATE_LOGIN_POPUP_APPEARED = gql`
  mutation UPDATE_LOGIN_POPUP_APPEARED {
    updateLoginPopupAppeared @client
  }
`
