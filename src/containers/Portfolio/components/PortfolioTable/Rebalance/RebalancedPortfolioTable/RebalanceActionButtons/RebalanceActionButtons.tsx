import React from 'react'
import SaveIcon from '@material-ui/icons/Save'
import EditIcon from '@material-ui/icons/Edit'
import Replay from '@material-ui/icons/Replay'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

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
  textColor,
  secondary,
  red,
  green,
}: IProps) => (
  <ActionButtonsContainer isEditModeEnabled={isEditModeEnabled}>
    <EditIconWrapper
      onClick={onEditModeEnable}
      isEditModeEnabled={isEditModeEnabled}
      textColor={textColor}
      red={red}
      green={green}
    >
      <Tooltip
        title={isEditModeEnabled ? `Discard changes` : `Edit table`}
        enterDelay={250}
        leaveDelay={200}
      >
          {isEditModeEnabled ? <ClearIcon /> : <EditIcon />}
      </Tooltip>
    </EditIconWrapper>
    {isEditModeEnabled && (
      <>
        <Tooltip title={`Reset to initial portfolio`} enterDelay={250} leaveDelay={200}>
            <ActionButton
              onClick={onReset}
              secondary={secondary}
              textColor={textColor}
            >
              <Replay />
            </ActionButton>
        </Tooltip>
        <Tooltip title={`Save changes`} enterDelay={250} leaveDelay={200}>
            <ActionButton
              onClick={onSaveClick}
              secondary={secondary}
              textColor={textColor}
            >
              <SaveIcon style={{ color: saveButtonColor }} />
            </ActionButton>
        </Tooltip>
      </>
    )}
  </ActionButtonsContainer>
)

export default RebalanceActionButtons
