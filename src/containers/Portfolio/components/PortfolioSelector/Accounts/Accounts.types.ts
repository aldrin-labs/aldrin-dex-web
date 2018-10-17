import { getKeysQuery } from '@containers/Portfolio/annotations'
import React from 'react'

export interface IProps {
  data: { getProfile: getKeysQuery }
  isCheckedAll: boolean
  isSideNavOpen: boolean
  onToggleAll: React.ReactEventHandler
  onToggleKeyCheckbox: Function
  setKeys: Function
  setActiveKeys: Function
  keys: string[]
  activeKeys: string[]
  color: string
}

export type keyItem = {
  _id: string,
    name: string | null,
    apiKey: string | null,
    secret: string | null,
    date: string | null,
    exchange:  {
    name: string | null,
      symbol: string | null,
  } | null,
}
