import React from 'react'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '@components/SvgIcon/SvgIcon'

import RebalanceMoneyButtons from './RebalanceMoneyButtons/RebalanceMoneyButtons'
import RebalanceActionButtons from './RebalanceActionButtons/RebalanceActionButtons'
import { formatNumberToUSFormat } from '@utils/PortfolioTableUtils'
import { IProps, IState } from './RebalancedPortfolioTable.types'
import { exchangeOptions, coinsOptions } from '.././mocks'

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
  SelectR,
} from './RebalancedPortfolioTable.styles'

import { Wrapper, Table, TableHeading } from '../sharedStyles/sharedStyles'

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
      onAddRowButtonClick,
      onDeleteRowClick,
      onPercentInputChange,
      onBlurPercentInput,
      onFocusPercentInput,
      handleSelectChange,
      onSelectActiveBalance,
      onSelectAllActive,
      onSaveClick,
      onReset,
      onEditModeEnable,
      updateState,
    } = this.props

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
          <RebalanceActionButtons {...{
            isEditModeEnabled,
            saveButtonColor,
            onSaveClick,
            onEditModeEnable,
            onReset,
          }} />
        </TableHeading>
        <Wrapper>
          <Table>
            <PTHead isEditModeEnabled={isEditModeEnabled}>
              <PTR>
                {isEditModeEnabled && (
                  <PTHR key="selectAll" style={{ textAlign: 'left' }}>
                    <Checkbox
                      onChange={onSelectAllActive}
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
                  exchange,
                  symbol,
                  portfolioPerc,
                  price,
                  deltaPrice,
                } = row

                const isSelected =
                  (selectedActive && selectedActive.indexOf(rowIndex) >= 0) ||
                  false

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
                        onClick={() => onSelectActiveBalance(rowIndex)}
                      >
                        {this.renderActiveCheckbox(rowIndex)}
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
                            <SelectR
                              key={`inputNameExchange${rowIndex}`}
                              classNamePrefix="custom-select-box"
                              isClearable
                              isSearchable
                              options={exchangeOptions}
                              menuPortalTarget={document.body}
                              menuStyles={{
                                minWidth: '150px',
                                height: '200px',
                              }}
                              menuListStyles={{
                                height: '200px',
                              }}
                              clearIndicatorStyles={{
                                padding: '2px',
                              }}
                              onChange={() =>
                                handleSelectChange(rowIndex, 'exchange')
                              }
                            />
                          </PTDR>
                        )
                      }

                      if (isNewCoinSymbol) {
                        return (
                          <PTDR key={`CoinSymbol${idx}`}>
                            <SelectR
                              key={`inputCoinSymbol${rowIndex}`}
                              classNamePrefix="custom-select-box"
                              isClearable
                              isSearchable
                              options={coinsOptions}
                              menuPortalTarget={document.body}
                              menuStyles={{
                                minWidth: '150px',
                                height: '200px',
                              }}
                              menuListStyles={{
                                height: '200px',
                              }}
                              clearIndicatorStyles={{
                                padding: '2px',
                              }}
                              onChange={() =>
                                handleSelectChange(rowIndex, 'symbol')
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
                        } else {
                          return (
                            <PTDR key={`percentageInCont${idx}`}>
                              <InputTable
                                key={`inputPercentage${rowIndex}`}
                                tabIndex={rowIndex + 1}
                                isPercentSumGood={isPercentSumGood}
                                value={rows[rowIndex].portfolioPerc}
                                onChange={(e) =>
                                  onPercentInputChange(e, rowIndex)
                                }
                                onBlur={(e) => onBlurPercentInput(e, rowIndex)}
                                onFocus={(e) =>
                                  onFocusPercentInput(e, rowIndex)
                                }
                              />
                            </PTDR>
                          )
                        }
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
                        onClick={() => onDeleteRowClick(rowIndex)}
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
                      onClick={onAddRowButtonClick}
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
          { ...{
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
