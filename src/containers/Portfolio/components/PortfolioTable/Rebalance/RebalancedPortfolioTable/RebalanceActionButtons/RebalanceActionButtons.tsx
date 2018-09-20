import React from 'react'
import SaveIcon from '@material-ui/icons/Save'
import EditIcon from '@material-ui/icons/Edit'
import Replay from '@material-ui/icons/Replay'
import ClearIcon from '@material-ui/icons/Clear'

import { IProps } from './RebalanceActionButtons.types'
import {
  ActionButtonsContainer,
  ActionButton,
  EditIconWrapper,
} from './RebalanceActionButtons.styles'

const RebalanceActionButtons = ({
  isEditModeEnabled,
  saveButtonColor,
  onSaveClick,
  onEditModeEnable,
  onReset,
  secondary,
  red,
  green,
}: IProps) => (
  <ActionButtonsContainer isEditModeEnabled={isEditModeEnabled}>
    <EditIconWrapper
      onClick={onEditModeEnable}
      isEditModeEnabled={isEditModeEnabled}
      red={red}
      green={green}
    >
      {isEditModeEnabled ? <ClearIcon /> : <EditIcon />}
    </EditIconWrapper>
    <ActionButton onClick={onReset} secondary={secondary}>
      <Replay />
    </ActionButton>
    <ActionButton onClick={onSaveClick} secondary={secondary}>
      <SaveIcon style={{ color: saveButtonColor }} />
    </ActionButton>
  </ActionButtonsContainer>
)

export default RebalanceActionButtons
