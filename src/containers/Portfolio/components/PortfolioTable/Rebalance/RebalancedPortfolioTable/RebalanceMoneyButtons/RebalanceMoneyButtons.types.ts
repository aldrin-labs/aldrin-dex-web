import React from 'react'

export interface IProps {
  isEditModeEnabled: boolean
  addMoneyInputValue: number
  undistributedMoney: number
  onAddMoneyInputChange: React.ChangeEventHandler
  onFocusAddMoneyInput: React.FocusEventHandler
  onAddMoneyButtonPressed: React.ReactEventHandler
  onDeleteUndistributedMoney: React.ReactEventHandler
  onDistribute: React.ReactEventHandler
}
