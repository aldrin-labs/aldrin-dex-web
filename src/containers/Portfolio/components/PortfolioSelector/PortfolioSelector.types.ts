import { getKeysQuery } from '../../annotations'
import React from 'react'

export interface IProps {
  data: getKeysQuery
  onChangeActive: Function
  filterValuesLessThenThat: Function
  isShownMocks: boolean
  isSideNavOpen: boolean
  toggleWallets: React.ReactEventHandler
  filterPercent: number
}

