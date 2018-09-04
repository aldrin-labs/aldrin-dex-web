import React from 'react'

export interface IProps {
  isEditModeEnabled: boolean
  saveButtonColor: string
  onSaveClick: React.ReactEventHandler
  onEditModeEnable: React.ReactEventHandler
  onReset: React.ReactEventHandler
}
