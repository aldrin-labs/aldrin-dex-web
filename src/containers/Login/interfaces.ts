export interface Props {
  user: any
  isShownModal: boolean
  loginStatus: boolean
  createUser: Function
  storeLogin: Function
  storeLogout: Function
  storeOpenModal: Function
}

export interface State {
  anchorEl: EventTarget | null
}
