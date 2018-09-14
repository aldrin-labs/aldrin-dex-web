import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '@components/SvgIcon/SvgIcon'

import RebalanceMoneyButtons from './RebalanceMoneyButtons/RebalanceMoneyButtons'
import RebalanceActionButtons from './RebalanceActionButtons/RebalanceActionButtons'
import {
  cloneArrayElementsOneLevelDeep,
  formatNumberToUSFormat,
} from '@utils/PortfolioTableUtils'
import { IProps, IState } from './RebalancedPortfolioTable.types'
import { exchangeOptions } from '.././mocks'
import SelectCoinList from '@components/SelectCoinList/SelectCoinList'
import SelectAllExchangeList from '@components/SelectAllExchangeList/SelectAllExchangeList'

import { Checkbox, Label, Span, Icon } from '@styles/cssUtils'
import {
  TableAndHeadingWrapper,
  PTHR,
  PTDR,
  PTR,
  PTBody,
  PTHead,
  PTFoot,
  TableButton,
  InputTable,
} from './RebalancedPortfolioTable.styles'

import { Wrapper, Table, TableHeading } from '../sharedStyles/sharedStyles'
import * as UTILS from '@utils/PortfolioRebalanceUtils'
import { IRow } from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'

const usdHeadingForRebalanced = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'USD', value: 'price' },
  { name: 'Trade', value: 'deltaPrice' },
]

const btcHeadingForRebalanced = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'BTC', value: 'price' },
  { name: 'Trade', value: 'deltaPrice' },
]

export default class RebalancedPortfolioTable extends React.Component<
  IProps,
  IState
> {

  renderActiveCheckbox = (idx: number) => {
    const { selectedActive } = this.props
    const isSelected =
      (selectedActive && selectedActive.indexOf(idx) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox type="checkbox" id={`${idx}`} checked={isSelected} />
        <Label htmlFor={`${idx}`} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onSelectActiveBalance = (idx: number) => {
    const selectedActive =
      (this.props.selectedActive && this.props.selectedActive.slice()) || []
    const hasIndex = selectedActive.indexOf(idx)
    if (hasIndex >= 0) {
      selectedActive.splice(hasIndex, 1)
    } else {
      selectedActive.push(idx)
    }

    const areAllActiveChecked = selectedActive.length === this.props.rows.length

    this.props.updateState({ selectedActive, areAllActiveChecked })
  }

  onSelectAllActive = () => {
    const selectedActive =
      (this.props.selectedActive && this.props.selectedActive.slice()) || []
    let { areAllActiveChecked } = this.props
    if (selectedActive.length === this.props.rows.length) {
      selectedActive.splice(0, selectedActive.length)
      areAllActiveChecked = false
    } else {
      selectedActive.splice(0, selectedActive.length)
      this.props.rows.forEach((a, i) => {
        selectedActive.push(i)
      })
      areAllActiveChecked = true
    }
    this.props.updateState({ selectedActive, areAllActiveChecked })
  }

  onFocusPercentInput = (
    e: React.FocusEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { rows, updateState } = this.props
    let percentInput = e.target.value

    if (percentInput === '0' || percentInput === 0) {
      percentInput = ''
    }

    const clonedRows = rows!.map((a: IRow) => ({ ...a }))
    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        portfolioPerc: percentInput,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    updateState({
      rows: resultRows,
    })
  }

  onBlurPercentInput = (e: React.FocusEvent<HTMLInputElement>, idx: number) => {
    const { rows, updateState } = this.props
    let percentInput = e.target.value

    if (!/^([0-9]{1,3}\.|)$/.test(percentInput)) {
      return
    }
    if (percentInput === '') {
      percentInput = '0'
    } else {
      percentInput = percentInput.slice(0, -1)
    }

    const clonedRows = rows.map((a) => ({ ...a }))
    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        portfolioPerc: percentInput,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    updateState({
      rows: resultRows,
    })
  }

  onPercentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const {
      rows,
      totalRows,
      staticRows,
      undistributedMoney,
      updateState,
    } = this.props
    const percentInput = e.target.value

    if (
      !/^([0-9]\.[0-9]{1,4}|[0-9]\.?|(!?[1-9][0-9]\.[0-9]{1,4}|[1-9][0-9]\.?)|100|100\.?|100\.[0]{1,4}?|)$/.test(
        percentInput
      )
    ) {
      return
    }

    const clonedRows = rows.map((a: IRow) => ({ ...a }))
    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        portfolioPerc: percentInput,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    const newCalculatedRowsWithPercents = UTILS.calculatePriceByPercents(
      resultRows,
      totalRows
    )
    const totalPercents = UTILS.calculateTotalPercents(
      newCalculatedRowsWithPercents
    )
    const rowWithNewPriceDiff = UTILS.calculatePriceDifference(
      newCalculatedRowsWithPercents,
      staticRows
    )
    const newTableTotalRows = UTILS.calculateTableTotal(
      newCalculatedRowsWithPercents
    )

    const oldRowPrice = rows[idx].price
    const newRowPrice = newCalculatedRowsWithPercents[idx].price
    const oldNewPriceDiff = parseFloat(oldRowPrice) - parseFloat(newRowPrice)

    updateState({
      totalPercents,
      rows: rowWithNewPriceDiff,
      isPercentSumGood: UTILS.checkPercentSum(newCalculatedRowsWithPercents),
      undistributedMoney: (
        parseFloat(undistributedMoney) + oldNewPriceDiff
      ).toFixed(2),
      totalTableRows: parseFloat(newTableTotalRows),
    })
  }

  handleSelectChange = (
    idx: number,
    name: string,
    optionSelected?: { label: string; value: string } | null
  ) => {

    console.log('idx', idx, 'name', name, 'optionSelected', optionSelected);


    const { rows, updateState } = this.props
    const value = optionSelected && !Array.isArray(optionSelected) ? optionSelected.value : ''
    const clonedRows = rows.map((a: IRow) => ({ ...a }))

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        [name]: value,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    console.log('value in handleSelectChange', value, 'resultRows ', resultRows);


    updateState({
      rows: resultRows,
    })
  }

  onAddRowButtonClick = () => {
    const clonedRows = cloneArrayElementsOneLevelDeep(this.props.rows)
    const { totalRows, staticRows, updateState } = this.props
    const newRow = {
      exchange: 'Exchange',
      symbol: 'Coin',
      portfolioPerc: 0.0,
      deltaPrice: 0,
      price: 0,
      editable: true,
    }
    clonedRows.push(newRow)
    const rows = UTILS.calculatePercents(clonedRows, totalRows, staticRows)
    const totalPercents = UTILS.calculateTotalPercents(rows)

    updateState({ rows, totalPercents, areAllActiveChecked: false })
  }

  onDeleteRowClick = (idx: number) => {
    const { rows, undistributedMoney, staticRows, updateState } = this.props
    const clonedRows = rows.map((a) => ({ ...a }))
    const currentRowMoney = clonedRows[idx].price
    const isEditableCoin = clonedRows[idx].editable

    const resultRows = isEditableCoin
      ? [
          ...clonedRows.slice(0, idx),
          ...clonedRows.slice(idx + 1, clonedRows.length),
        ]
      : [
          ...clonedRows.slice(0, idx),
          {
            ...clonedRows[idx],
            price: '0',
          },
          ...clonedRows.slice(idx + 1, clonedRows.length),
        ]

    const newUndistributedMoney = (
      parseFloat(undistributedMoney) + parseFloat(currentRowMoney)
    ).toFixed(2)

    const newTotalRows = UTILS.calculateTotal(resultRows, newUndistributedMoney)
    const newTableTotalRows = UTILS.calculateTableTotal(resultRows)
    const newRowsWithNewPercents = UTILS.calculatePercents(
      resultRows,
      newTotalRows,
      staticRows
    )
    const totalPercents = UTILS.calculateTotalPercents(newRowsWithNewPercents)

    const newIsPercentSumGood = UTILS.checkPercentSum(newRowsWithNewPercents)

    updateState({
      totalPercents,
      undistributedMoney: newUndistributedMoney,
      totalRows: newTotalRows,
      totalTableRows: newTableTotalRows,
      rows: newRowsWithNewPercents,
      isPercentSumGood: newIsPercentSumGood,
    })
  }

  render() {
    const {
      rows,
      staticRows,
      currentSortForDynamic,
      selectedActive,
      areAllActiveChecked,
      totalRows,
      totalTableRows,
      totalPercents,
      isPercentSumGood,
      undistributedMoney,
      isUSDCurrently,
      isEditModeEnabled,
      addMoneyInputValue,
      onSortTable,
      onSaveClick,
      onReset,
      onEditModeEnable,
      updateState,
    } = this.props

    console.log('render! RebalancedPortfolioTable');


    const saveButtonColor =
      isPercentSumGood && undistributedMoney >= 0 ? '#4caf50' : '#f44336'

    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" />
    ) : (
      <Icon className="fa fa-btc" />
    )

    const tableHeadingsRebalancedPortfolio = isUSDCurrently
      ? usdHeadingForRebalanced
      : btcHeadingForRebalanced

    return (
      <TableAndHeadingWrapper isEditModeEnabled={isEditModeEnabled}>
        <TableHeading>
          Rebalanced portfolio
          <RebalanceActionButtons
            {...{
              isEditModeEnabled,
              saveButtonColor,
              onSaveClick,
              onEditModeEnable,
              onReset,
            }}
          />
        </TableHeading>
        <Wrapper>
          <Table>
            <PTHead isEditModeEnabled={isEditModeEnabled}>
              <PTR>
                {isEditModeEnabled && (
                  <PTHR key="selectAll" style={{ textAlign: 'left' }}>
                    <Checkbox
                      onChange={this.onSelectAllActive}
                      checked={areAllActiveChecked}
                      type="checkbox"
                      id="selectAllActive"
                    />
                    <Label htmlFor="selectAllActive">
                      <Span />
                    </Label>
                  </PTHR>
                )}

                {tableHeadingsRebalancedPortfolio.map((heading) => {
                  const isSorted =
                    currentSortForDynamic &&
                    currentSortForDynamic.key === heading.value

                  return (
                    <PTHR
                      key={heading.name}
                      onClick={() =>
                        onSortTable(heading.value, 'currentSortForDynamic')
                      }
                    >
                      {heading.name}

                      {isSorted && (
                        <SvgIcon
                          src={sortIcon}
                          width={12}
                          height={12}
                          style={{
                            verticalAlign: 'middle',
                            marginLeft: '4px',
                            transform:
                              currentSortForDynamic &&
                              currentSortForDynamic.arg === 'ASC'
                                ? 'rotate(180deg)'
                                : null,
                          }}
                        />
                      )}
                    </PTHR>
                  )
                })}

                {isEditModeEnabled && <PTHR />}
              </PTR>
            </PTHead>

            <PTBody isEditModeEnabled={isEditModeEnabled}>
              {rows.map((row, rowIndex) => {
                const {
                  id,
                  exchange,
                  symbol,
                  portfolioPerc,
                  price,
                  deltaPrice,
                } = row

                const isSelected =
                  (selectedActive && selectedActive.indexOf(id) >= 0) || false

                let deltaPriceString = ''

                if (deltaPrice && +deltaPrice) {
                  if (deltaPrice > 0) {
                    deltaPriceString = `BUY ${symbol}  $ ${formatNumberToUSFormat(
                      deltaPrice
                    )}`
                  } else {
                    deltaPriceString = `SELL ${symbol}  $ ${formatNumberToUSFormat(
                      Math.abs(parseFloat(deltaPrice))
                    )}`
                  }
                }

                const cols = [
                  exchange,
                  symbol || '',
                  portfolioPerc ? `${portfolioPerc}%` : '',
                  `${formatNumberToUSFormat(price)}`,
                  deltaPriceString,
                ]

                return (
                  <PTR key={`${rowIndex}`} isSelected={isSelected}>
                    {isEditModeEnabled && (
                      <PTDR
                        key="smt"
                        isSelected={isSelected}
                        onClick={() => this.onSelectActiveBalance(id)}
                      >
                        {this.renderActiveCheckbox(id)}
                      </PTDR>
                    )}

                    {cols.map((col, idx) => {
                      const isNewCoinName =
                        row.editable && idx === 0 && isEditModeEnabled
                      const isNewCoinSymbol =
                        row.editable && idx === 1 && isEditModeEnabled

                      if (isNewCoinName) {
                        return (
                          <PTDR key={`NameExchange${idx}`}>
                            <SelectAllExchangeList
                              key={`inputNameExchange${rowIndex}`}
                              classNamePrefix="custom-select-box"
                              isClearable={true}
                              isSearchable={true}
                              options={exchangeOptions}
                              menuPortalTarget={document.body}
                              menuStyles={{
                                minWidth: '150px',
                                height: '200px',
                              }}
                              menuListStyles={{
                                fontSize:'12px',
                                height: '200px',
                              }}
                              clearIndicatorStyles={{
                                padding: '2px',
                              }}
                              onChange={(optionSelected: { label: string; value: string } | null) =>
                                this.handleSelectChange(rowIndex, 'exchange', optionSelected)
                              }
                            />
                          </PTDR>
                        )
                      }

                      if (isNewCoinSymbol) {
                        return (
                          <PTDR key={`CoinSymbol${idx}`}>
                            <SelectCoinList
                              key={`inputCoinSymbol${rowIndex}`}
                              classNamePrefix="custom-select-box"
                              isClearable={true}
                              isSearchable={true}
                              menuPortalTarget={document.body}
                              menuStyles={{
                              minWidth: '150px',
                              height: '200px',
                              }}
                              menuListStyles={{
                                fontSize:'12px',
                              height: '200px',
                              }}
                              clearIndicatorStyles={{
                              padding: '2px',
                              }}
                              onChange={(optionSelected: { label: string; value: string } | null) =>
                              this.handleSelectChange(rowIndex, 'symbol', optionSelected)
                              }
                              />
                          </PTDR>
                        )
                      }

                      if (idx === 2) {
                        const color =
                          Number(col.replace(/%/g, '')) >= 0
                            ? '#4caf50'
                            : '#f44336'
                        if (!isEditModeEnabled) {
                          return (
                            <PTDR key={`${col}${idx}`} style={{ color }}>
                              {col}
                            </PTDR>
                          )
                        }

                        return (
                          <PTDR key={`percentageInCont${idx}`}>
                            <InputTable
                              key={`inputPercentage${rowIndex}`}
                              tabIndex={rowIndex + 1}
                              isPercentSumGood={isPercentSumGood}
                              value={rows[rowIndex].portfolioPerc}
                              onChange={(e) =>
                                this.onPercentInputChange(e, rowIndex)
                              }
                              onBlur={(e) =>
                                this.onBlurPercentInput(e, rowIndex)
                              }
                              onFocus={(e) =>
                                this.onFocusPercentInput(e, rowIndex)
                              }
                            />
                          </PTDR>
                        )
                      }
                      if (col.match(/BUY/g)) {
                        const color = '#4caf50'

                        return (
                          <PTDR
                            key={`buy${idx}${col}${rowIndex}`}
                            style={{ color }}
                          >
                            {col}
                          </PTDR>
                        )
                      }
                      if (col.match(/SELL/g)) {
                        const color = '#f44336'

                        return (
                          <PTDR
                            key={`sell${idx}${col}${rowIndex}`}
                            style={{ color }}
                          >
                            {col}
                          </PTDR>
                        )
                      }

                      if (idx === 3) {
                        return (
                          <PTDR key={`${col}${idx}`}>
                            {mainSymbol}
                            {col}
                          </PTDR>
                        )
                      }

                      return <PTDR key={`${col}${idx}`}>{col}</PTDR>
                    })}
                    <PTDR>
                      <TableButton
                        isDeleteColor={false}
                        onClick={() => this.onDeleteRowClick(rowIndex)}
                      >
                        <DeleteIcon />
                      </TableButton>
                    </PTDR>
                  </PTR>
                )
              })}
              {isEditModeEnabled && (
                <PTR>
                  <PTDR />
                  <PTDR />
                  <PTDR />
                  <PTDR />
                  <PTDR />
                  <PTDR />
                  <PTDR>
                    <TableButton
                      isDeleteColor={true}
                      onClick={this.onAddRowButtonClick}
                    >
                      <AddIcon />
                    </TableButton>
                  </PTDR>
                </PTR>
              )}
            </PTBody>
            <PTFoot isEditModeEnabled={isEditModeEnabled}>
              <PTR>
                {isEditModeEnabled && <PTHR style={{ width: '38px' }} />}
                <PTHR>Subtotal</PTHR>
                <PTHR>-</PTHR>
                <PTHR>{`${totalPercents}%`}</PTHR>
                <PTHR>
                  {mainSymbol}
                  {formatNumberToUSFormat(totalTableRows)}
                </PTHR>
                <PTHR>-</PTHR>
                <PTHR>-</PTHR>
              </PTR>
              <PTR>
                {isEditModeEnabled && <PTHR style={{ width: '38px' }} />}
                <PTHR>All</PTHR>
                <PTHR>-</PTHR>
                <PTHR>-</PTHR>
                <PTHR>
                  {mainSymbol}
                  {formatNumberToUSFormat(totalRows)}
                </PTHR>
                <PTHR>-</PTHR>
                <PTHR>-</PTHR>
              </PTR>
            </PTFoot>
          </Table>
        </Wrapper>
        <RebalanceMoneyButtons
          {...{
            isEditModeEnabled,
            addMoneyInputValue,
            undistributedMoney,
            staticRows,
            rows,
            selectedActive,
            updateState,
          }}
        />
      </TableAndHeadingWrapper>
    )
  }
}
