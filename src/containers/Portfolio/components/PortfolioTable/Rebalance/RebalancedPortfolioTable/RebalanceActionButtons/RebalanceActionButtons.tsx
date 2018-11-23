import React from 'react'
import SaveIcon from '@material-ui/icons/Save'
import Replay from '@material-ui/icons/Replay'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import { IProps } from './RebalanceActionButtons.types'
import { ActionButtonsContainer } from './RebalanceActionButtons.styles'

const RebalanceActionButtons = ({
  isEditModeEnabled,
  saveButtonColor,
  onSaveClick,
  onEditModeEnable,
  onReset,
  red,
}: IProps) => (
  <ActionButtonsContainer isEditModeEnabled={isEditModeEnabled}>
    <Tooltip title={`Discard changes`} enterDelay={250} leaveDelay={200}>
      <IconButton style={{ color: red }} onClick={onEditModeEnable}>
        <ClearIcon />
      </IconButton>
    </Tooltip>

    <>
      <Tooltip
        title={`Reset to initial portfolio`}
        enterDelay={250}
        leaveDelay={200}
      >
        <IconButton onClick={onReset}>
          <Replay />
        </IconButton>
      </Tooltip>
      <Tooltip title={`Save changes`} enterDelay={250} leaveDelay={200}>
        <IconButton style={{ color: saveButtonColor }} onClick={onSaveClick}>
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </>
  </ActionButtonsContainer>
)

export default RebalanceActionButtons
