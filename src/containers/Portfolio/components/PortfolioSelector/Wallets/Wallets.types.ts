import { getWalletsQuery } from '@containers/Portfolio/annotations'

export interface IProps {
  data: {getProfile: getWalletsQuery}
  setWallets: Function
  setActiveWallets: Function
  wallets: string[]
  activeWallets: string[]
  onToggleWalletCheckbox: Function
  color: string
}

export type walletItem = {
  _id: string
  name: string | null
}
