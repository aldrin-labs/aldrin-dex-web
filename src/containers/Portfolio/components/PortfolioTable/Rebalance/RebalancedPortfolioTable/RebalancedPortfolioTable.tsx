import React, { CSSProperties } from 'react'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import SaveIcon from 'material-ui-icons/Save'
import EditIcon from 'material-ui-icons/Edit'
import Replay from 'material-ui-icons/Replay'
import ClearIcon from 'material-ui-icons/Clear'
import { components } from 'react-select'
import { OptionProps } from 'react-select/lib/types'

import sortIcon from '@icons/arrow.svg'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import dropDownIcon from '@icons/baseline-arrow_drop_down.svg'
import { formatNumberToUSFormat } from '@utils/PortfolioTableUtils'
import { IProps, IState } from './RebalancedPortfolioTable.types'
import { exchangeOptions, coinsOptions } from '.././mocks'
import { Checkbox, Icon } from '@utils/cssUtils'

import {
  TableAndHeadingWrapper,
  PTHR,
  PTDR,
  PTR,
  PTBody,
  PTHead,
  PTFoot,
  ActionButton,
  ActionButtonsContainer,
  Input,
  Button,
  TableButton,
  InputTable,
  AddMoneyContainer,
  ButtonsInnerWrapper,
  ButtonsWrapper,
  EditIconWrapper,
  UndistributedMoneyContainer,
  UndistributedMoneyText,
  SelectR,
} from './RebalancedPortfolioTable.styles'

import { Wrapper, Table, TableHeading, Span, Label } from '../sharedStyles/sharedStyles'

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
      onAddMoneyInputChange,
      onFocusAddMoneyInput,
      onAddMoneyButtonPressed,
      onDeleteUndistributedMoney,
      handleSelectChange,
      onSelectActiveBalance,
      onSelectAllActive,
      onSaveClick,
      onReset,
      onDistribute,
      onEditModeEnable,
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
          <ActionButtonsContainer isEditModeEnabled={isEditModeEnabled}>
            <EditIconWrapper
              onClick={onEditModeEnable}
              isEditModeEnabled={isEditModeEnabled}
            >
              {isEditModeEnabled ? <ClearIcon /> : <EditIcon />}
            </EditIconWrapper>
            <ActionButton onClick={onReset}>
              <Replay />
            </ActionButton>
            <ActionButton onClick={onSaveClick}>
              <SaveIcon style={{ color: saveButtonColor }} />
            </ActionButton>
          </ActionButtonsContainer>
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
                      onClick={() => onSortTable(heading.value, 'currentSortForDynamic')}
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
                              styles={customStyles}
                              isClearable
                              isSearchable
                              options={exchangeOptions}
                              menuPortalTarget={document.body}
                              components={{ DropdownIndicator }}
                              onChange={() => handleSelectChange(
                                rowIndex,
                                'exchange'
                              )}
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
                              styles={customStyles}
                              isClearable
                              isSearchable
                              options={coinsOptions}
                              menuPortalTarget={document.body}
                              components={{ DropdownIndicator }}
                              onChange={ () => handleSelectChange(
                                rowIndex,
                                'symbol'
                              )}
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
                                onBlur={(e) =>
                                  onBlurPercentInput(e, rowIndex)
                                }
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
                  Undistributed money:{' '}
                  {formatNumberToUSFormat(undistributedMoney)}
                </UndistributedMoneyText>
                <Button
                  disabled={undistributedMoney < 0}
                  onClick={onDistribute}
                >
                  Distribute to selected
                </Button>
              </UndistributedMoneyContainer>
            }
          </ButtonsInnerWrapper>
        </ButtonsWrapper>
      </TableAndHeadingWrapper>
    )
  }
}


const customStyles = {
  control: () => ({
    boxSizing: 'border-box',
    cursor: 'default',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    outline: '0',
    transition: 'all 100ms',
    backgroundColor: 'transparent',
    minHeight: '0.8em',
    border: 'none',
  }),
  menu: (base: CSSProperties) => ({
    ...base,
    backgroundColor: '#424242',
    minWidth: '150px',
    maxHeight: '200px',
    height: '200px',
  }),
  menuList: (base: CSSProperties) => ({
    ...base,
    maxHeight: '200px',
  }),
  option: (base: CSSProperties, state: OptionProps) => ({
    ...base,
    color: '#fff',
    fontSize: '1.5em',
    fontFamily: 'Roboto',
    backgroundColor: state.isSelected
      ? 'rgba(255, 255, 255, 0.2)'
      : state.isFocused
        ? 'rgba(255, 255, 255, 0.1)'
        : '#424242',
    [':active']: null,
  }),
  clearIndicator: () => ({
    [':hover']: {
      color: '#fff',
    },
    display: 'flex',
    width: '20px',
    boxSizing: 'border-box',
    color: 'hsl(0, 0%, 80%)',
    padding: '2px',
    transition: 'color 150ms',
  }),
  dropdownIndicator: () => ({
    [':hover']: {
      color: '#fff',
    },
    display: 'flex',
    width: '20px',
    boxSizing: 'border-box',
    color: 'hsl(0, 0%, 80%)',
    padding: '2px',
    transition: 'color 150ms',
  }),
  valueContainer: (base: CSSProperties) => ({
    ...base,
    paddingLeft: 0,
  }),
  singleValue: (base: CSSProperties) => ({
    ...base,
    color: '#fff',
    marginLeft: '0',
  }),
  placeholder: (base: CSSProperties) => ({
    ...base,
    marginLeft: 0,
  }),
  input: (base: CSSProperties) => ({
    ...base,
    color: '#fff',
  }),
  multiValue: (base: CSSProperties) => ({
    ...base,
    [':hover']: {
      borderColor: '#4ed8da',
    },

    color: '#fff',
    borderRadius: '3px',
    fontWeight: 'bold',
    backgroundColor: '#2a2d32',
  }),
  multiValueLabel: (base: CSSProperties) => ({
    ...base,
    color: '#fff',
  }),
  multiValueRemove: (base: CSSProperties) => ({
    ...base,
    [':hover']: {
      color: '#fff',
      backgroundColor: '#4ed8da',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
}

// TODO: replace any with CommonProps from @types/react-select
const DropdownIndicator = (props: any) =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <SvgIcon
        src={dropDownIcon}
        width={19}
        height={19}
        style={{
          verticalAlign: 'middle',
        }}
      />
    </components.DropdownIndicator>
  )
