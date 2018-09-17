export interface Props {
  user: any
  isShownModal: boolean
  loginStatus: boolean
  modalIsOpen: boolean
  createUser: Function
  storeLogin: Function
  storeLogout: Function
  storeOpenedModal: Function
  storeClosedModal: Function
}

export interface State {
  anchorEl: EventTarget | null
}
