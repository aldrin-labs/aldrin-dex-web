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
    const { selectedActive, rows, staticRows, undistributedMoney, updateState } = this.props
    if (selectedActive && selectedActive.length > 0) {
      let money = parseFloat(undistributedMoney)

      if (selectedActive.length > 1) {
        const moneyPart = Math.floor(money / selectedActive.length)
        selectedActive.forEach((row, i) => {
          // TODO: Refactor when we have much more time than now
          // tslint:disable-next-line no-object-mutation
          const roundedCurrentPrice = parseFloat(
            rows![selectedActive![i]]!.price
          )
          rows![selectedActive![i]]!.price = (roundedCurrentPrice + moneyPart).toFixed(2)
          money -= moneyPart
        })
      } else {
        const roundedPrice = parseFloat(rows![selectedActive![0]]!.price)
        // console.log('roundedPrice', roundedPrice, 'typeof roundedPrice', typeof roundedPrice);
        // console.log('undistributedMoney', undistributedMoney, 'typeof undistributedMoney', typeof undistributedMoney);
        // tslint:disable-next-line no-object-mutation
        rows![selectedActive![0]]!.price = (
          roundedPrice + parseFloat(undistributedMoney)).toFixed(2)
        money = 0
      }

      // toFixed(2) for undistributed money is just an experiment
      const newUndistributedMoney = money.toFixed(2)

      const newTotal = UTILS.calculateTotal(rows, newUndistributedMoney)
      const newTableTotal = UTILS.calculateTableTotal(rows)
      const newRows = UTILS.calculatePercents(rows, newTotal, staticRows)
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

    const { addMoneyInputValue, undistributedMoney, isEditModeEnabled } = this.props

    return (
      <ButtonsWrapper isEditModeEnabled={isEditModeEnabled}>
        <ButtonsInnerWrapper>
          <AddMoneyContainer>
            <Input
              type="number"
              value={addMoneyInputValue}
              onChange={this.onAddMoneyInputChangeHandler}
              onFocus={this.onFocusAddMoneyInputHandler}
            />
            <Button onClick={this.onAddMoneyButtonPressedHandler}>Add money</Button>
          </AddMoneyContainer>
          <AddMoneyContainer>
            <Button onClick={this.onDeleteUndistributedMoneyHandler}>
              Delete undistributed
            </Button>
          </AddMoneyContainer>
          {
            <UndistributedMoneyContainer>
              <UndistributedMoneyText>
                Undistributed money: {formatNumberToUSFormat(undistributedMoney)}
              </UndistributedMoneyText>
              <Button disabled={+undistributedMoney < 0} onClick={this.onDistributeHandler}>
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
