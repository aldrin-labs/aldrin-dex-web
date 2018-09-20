export interface Props {
  user: any
  isShownModal: boolean
  mainColor: string
  loginStatus: boolean
  createUser: Function
  storeLogin: Function
  storeLogout: Function
}

export interface State {
  anchorEl: EventTarget | null
  lock: Auth0LockStatic | null
}
