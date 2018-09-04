import React from 'react'

import { formatNumberToUSFormat } from '@utils/PortfolioTableUtils'
import { IProps } from './RebalanceMoneyButtons.types'
import {
  ButtonsWrapper,
  ButtonsInnerWrapper,
  UndistributedMoneyContainer,
  UndistributedMoneyText,
  AddMoneyContainer,
  Button,
  Input,
} from './RebalanceMoneyButtons.styles'

const RebalanceMoneyButtons = ({
  isEditModeEnabled,
  addMoneyInputValue,
  onDistribute,
  onAddMoneyInputChange,
  onFocusAddMoneyInput,
  onAddMoneyButtonPressed,
  onDeleteUndistributedMoney,
  undistributedMoney,
}: IProps) => (
  <ButtonsWrapper isEditModeEnabled={isEditModeEnabled}>
    <ButtonsInnerWrapper>
      <AddMoneyContainer>
        <Input
          type="number"
          value={addMoneyInputValue}
          onChange={onAddMoneyInputChange}
          onFocus={onFocusAddMoneyInput}
        />
        <Button onClick={onAddMoneyButtonPressed}>Add money</Button>
      </AddMoneyContainer>
      <AddMoneyContainer>
        <Button onClick={onDeleteUndistributedMoney}>
          Delete undistributed
        </Button>
      </AddMoneyContainer>
      {
        <UndistributedMoneyContainer>
          <UndistributedMoneyText>
            Undistributed money: {formatNumberToUSFormat(undistributedMoney)}
          </UndistributedMoneyText>
          <Button disabled={undistributedMoney < 0} onClick={onDistribute}>
            Distribute to selected
          </Button>
        </UndistributedMoneyContainer>
      }
    </ButtonsInnerWrapper>
  </ButtonsWrapper>
)

export default RebalanceMoneyButtons
