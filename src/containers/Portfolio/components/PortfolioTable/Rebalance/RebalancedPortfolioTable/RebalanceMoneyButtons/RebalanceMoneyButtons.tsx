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
import * as UTILS from '@utils/PortfolioRebalanceUtils'
import { IRow } from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'

export class RebalanceMoneyButtons extends React.Component<IProps> {
  onDeleteUndistributedMoneyHandler = () => {
    const { rows, staticRows, updateState } = this.props

    const newUndistributedMoney = '0'
    const newTotalRows = UTILS.calculateTotal(rows, newUndistributedMoney)
    const newTableTotalRows = UTILS.calculateTableTotal(rows)
    const newRowsWithNewPercents = UTILS.calculatePercents(
      rows,
      newTotalRows,
      staticRows
    )
    const totalPercents = UTILS.calculateTotalPercents(newRowsWithNewPercents)
    const newIsPercentSumGood = UTILS.checkPercentSum(newRowsWithNewPercents)

    updateState({
      totalPercents,
      undistributedMoney: '0',
      totalRows: newTotalRows,
      totalTableRows: newTableTotalRows,
      rows: newRowsWithNewPercents,
      isPercentSumGood: newIsPercentSumGood,
    })
  }

  onDistributeHandler = () => {
    const {
      selectedActive,
      rows,
      staticRows,
      undistributedMoney,
      updateState,
    } = this.props

    if (!selectedActive || selectedActive.length === 0) {
      return
    }

    let resultRows: IRow[]
    let money = parseFloat(undistributedMoney)

    if (selectedActive.length > 1) {
      const arrayOfMoneyPart: number[] = UTILS.calculateMoneyPart(
        money,
        selectedActive.length
      ).sort((a, b) => b - a)

      resultRows = rows.map((row, i) => {
        return selectedActive.includes(i)
          ? {
              ...row,
              price: (parseFloat(row.price) + arrayOfMoneyPart.pop()).toFixed(
                2
              ),
            }
          : row
      })
    } else {
      const index: number = selectedActive[0]
      resultRows = [
        ...rows.slice(0, index),
        {
          ...rows[index],
          price: (parseFloat(rows[index].price) + money).toFixed(2),
        },
        ...rows.slice(index + 1, rows.length),
      ]
    }

    const newUndistributedMoney = 0..toFixed(2)
    const newTotal = UTILS.calculateTotal(resultRows, newUndistributedMoney)
    const newTableTotal = UTILS.calculateTableTotal(resultRows)
    const newRows = UTILS.calculatePercents(resultRows, newTotal, staticRows)
    const totalPercents = UTILS.calculateTotalPercents(newRows)

    updateState({
      totalPercents,
      selectedActive,
      undistributedMoney: newUndistributedMoney,
      rows: newRows,
      totalRows: newTotal,
      totalTableRows: newTableTotal,
      isPercentSumGood: UTILS.checkPercentSum(newRows),
    })
  }

  onAddMoneyInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAddMoney = e.target.value

    if (!/^(!?(-?[0-9]+\.?[0-9]+)|(-?[0-9]\.?)|)$/.test(inputAddMoney)) {
      return
    }

    const { updateState } = this.props
    updateState({ addMoneyInputValue: inputAddMoney })
  }
  onFocusAddMoneyInputHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    let inputAddMoney = e.target.value

    if (inputAddMoney === 0 || inputAddMoney === '0') {
      inputAddMoney = ''

      const { updateState } = this.props
      updateState({ addMoneyInputValue: inputAddMoney })
    }
  }

  onAddMoneyButtonPressedHandler = () => {
    if (+this.props.addMoneyInputValue === 0) {
      return
    }

    const {
      rows,
      staticRows,
      addMoneyInputValue,
      undistributedMoney,
      updateState,
    } = this.props

    const newUndistributedMoney = (
      Number(undistributedMoney) + Number(addMoneyInputValue)
    ).toFixed(2)

    const newTotal = UTILS.calculateTotal(rows, newUndistributedMoney)
    const newTableTotal = UTILS.calculateTableTotal(rows)

    const newRows = UTILS.calculatePercents(rows, newTotal, staticRows)
    const totalPercents = UTILS.calculateTotalPercents(newRows)
    const checkedPercentsIsGood = UTILS.checkPercentSum(newRows)

    updateState({
      totalPercents,
      undistributedMoney: newUndistributedMoney,
      addMoneyInputValue: 0,
      rows: newRows,
      totalRows: newTotal,
      totalTableRows: newTableTotal,
      isPercentSumGood: checkedPercentsIsGood,
    })
  }

  render() {
    const {
      addMoneyInputValue,
      undistributedMoney,
      isEditModeEnabled,
      secondary,
    } = this.props

    return (
      <ButtonsWrapper isEditModeEnabled={isEditModeEnabled}>
        <ButtonsInnerWrapper>
          <AddMoneyContainer>
            <Input
              type="number"
              value={addMoneyInputValue}
              onChange={this.onAddMoneyInputChangeHandler}
              onFocus={this.onFocusAddMoneyInputHandler}
              secondary={secondary}
            />
            <Button
              onClick={this.onAddMoneyButtonPressedHandler}
              secondary={secondary}
            >
              Add money
            </Button>
          </AddMoneyContainer>
          <AddMoneyContainer>
            <Button
              onClick={this.onDeleteUndistributedMoneyHandler}
              secondary={secondary}
            >
              Delete undistributed
            </Button>
          </AddMoneyContainer>
          {
            <UndistributedMoneyContainer>
              <UndistributedMoneyText>
                Undistributed money:{' '}
                {formatNumberToUSFormat(undistributedMoney)}
              </UndistributedMoneyText>
              <Button
                disabled={+undistributedMoney < 0}
                onClick={this.onDistributeHandler}
                secondary={secondary}
              >
                Distribute to selected
              </Button>
            </UndistributedMoneyContainer>
          }
        </ButtonsInnerWrapper>
      </ButtonsWrapper>
    )
  }
}

export default RebalanceMoneyButtons
