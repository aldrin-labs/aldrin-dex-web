import React from 'react'

export interface IProps {
  filterValuesLessThenThat: Function
  isShownMocks: boolean
  isSideNavOpen: boolean
  toggleWallets: React.ReactEventHandler
  filterPercent: number
  setKeys: Function
  setActiveKeys: Function
  setWallets: Function
  setActiveWallets: Function
  wallets: string[]
  activeWallets: string[]
  keys: string[]
  activeKeys: string[]
}

