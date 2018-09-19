import { Theme } from '@material-ui/core'

export interface Props {
  theme: Theme
  user: any
  isShownModal: boolean
  loginStatus: boolean
  modalIsOpen: boolean
  isLogging: boolean
  onLogin: Function
  createUser: Function
  storeLogin: Function
  storeLogout: Function
  storeOpenedModal: Function
  storeModalIsClosing: Function
  storeClosedModal: Function
}

export interface State {
  anchorEl: EventTarget | null
}
