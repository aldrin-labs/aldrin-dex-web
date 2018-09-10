import { IRow } from '../Rebalance.types'
import React from 'react'

export interface IProps {
  rows: IRow[]
  staticRows: IRow[]
  currentSortForDynamic: { key: string; arg: 'ASC' | 'DESC' } | null
  totalRows: number | string
  selectedActive: number[] | null
  areAllActiveChecked: boolean
  totalTableRows: number | string
  totalPercents: number | string
  isPercentSumGood: boolean
  undistributedMoney: number | string
  isUSDCurrently: boolean
  addMoneyInputValue: number | string
  isEditModeEnabled: boolean
  onSortTable: Function
  onSaveClick: React.ReactEventHandler
  onReset: React.ReactEventHandler
  onEditModeEnable: React.ReactEventHandler
  updateState: Function
}

export interface IState {

}
