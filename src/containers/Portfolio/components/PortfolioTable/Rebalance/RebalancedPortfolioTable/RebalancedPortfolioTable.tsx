import React, { CSSProperties } from 'react'
import styled, { css } from 'styled-components'

import { exchangeOptions, coinsOptions } from '.././mocks'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import SaveIcon from 'material-ui-icons/Save'
import EditIcon from 'material-ui-icons/Edit'
import Replay from 'material-ui-icons/Replay'
import ClearIcon from 'material-ui-icons/Clear'
import sortIcon from '@icons/arrow.svg'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import dropDownIcon from '@icons/baseline-arrow_drop_down.svg'
import { customAquaScrollBar } from '@utils/cssUtils'
import { formatNumberToUSFormat } from '@utils/PortfolioTableUtils'
import { IProps, IState } from './RebalancedPortfolioTable.types'
import { OptionProps } from 'react-select/lib/types'
import SelectReact, { components } from 'react-select'

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


    console.log(isEditModeEnabled);


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

const TableAndHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  
  &:not(:first-child) {
    min-height: ${(props: { isEditModeEnabled?: boolean }) =>
  props.isEditModeEnabled ? '55vh' : ''};
  }


  &:not(:first-child) {
    padding-left: 60px;
  }

  ${customAquaScrollBar};
`

const Wrapper = styled.div`
  overflow-y: scroll;
  padding-right: 2px;

  ${customAquaScrollBar};
`

const Table = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  display: inline-block;
`

const TableHeading = styled.div`
  display: flex;
  text-transform: uppercase;
  font-family: Roboto, sans-serif;
  font-size: 17px;
  color: white;
  font-weight: bold;
  letter-spacing: 1.1px;
  min-height: 30px;
`

const PT = css`
  display: table;
  width: 100%;
  position: sticky;
  z-index: 1;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`
const PTH = css`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: left;
  font-weight: 500;
  position: relative;
  padding: 10px 16px 10px 10px;
`
const PTHR = styled.th`
  ${PTH};
`


const PTDRNoEditMode = css`
  min-width: 100px;

  &:nth-child(2) {
    min-width: 70px;
  }

  &:nth-child(3) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
    &:hover {
      & svg {
        color: #ffffff;
      }
    }
  }
  &:nth-child(5) {
    min-width: 150px;
  }
  &:nth-child(6) {
    display: none;
  }
`

const PTD = css`
  color: ${(props: { isSelected?: boolean }) =>
  props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  white-space: nowrap;

  & svg {
    width: 15px;
    height: 15px;
  }
`

const PTDR = styled.td`
  ${PTD};
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
  border-bottom: 1px solid #fff;

  & ${PTDR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
  props.isEditModeEnabled ? PTDREditMode : PTDRNoEditMode};
  }
`

const PTHRNoEditMode = css`
  min-width: 100px;
  &:nth-child(1) {
  }

  &:nth-child(2) {
    text-align: left;
    min-width: 70px;
  }

  &:nth-child(3) {
    text-align: right;
  }

  &:nth-child(4) {
    text-align: right;
  }

  &:nth-child(5) {
    min-width: 150px;
  }
  &:nth-child(6) {
    display: none;
  }
`
const PTHREditMode = css`
  &:nth-child(1) {
    padding: 10px;
    text-align: left;
  }

  &:nth-child(2) {
    text-align: left;
    min-width: 100px;
  }

  &:nth-child(3) {
    min-width: 100px;
  }

  &:nth-child(4),
  &:nth-child(5) {
    text-align: right;
    min-width: 100px;
  }
  &:nth-child(6) {
    text-align: left;
    min-width: 150px;
  }
  &:nth-child(7) {
    width: 30px;
    text-align: left;
    padding: 1.75px 5px;
  }
`

const PTHead = styled.thead`
  ${PT};
  top: 0;
  user-select: none;
  
  & ${PTHR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? PTHREditMode : PTHRNoEditMode}
`

const PTFoot = styled.tfoot`
  ${PT};
  bottom: 0;

  &::before {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px solid white;
  }
  
  & ${PTHR} {
    ${(props: { isEditModeEnabled?: boolean }) =>
  props.isEditModeEnabled ? PTHREditMode : PTHRNoEditMode};
`

const PTDREditMode = css`
  ${PTD};

  &:nth-child(1) {
    padding: 1.75px 10px;
  }

  &:nth-child(2) {
    min-width: 100px;
  }
  &:nth-child(3) {
    min-width: 100px;
  }
  &:nth-child(4) {
    text-align: right;
    min-width: 100px;
    &:hover {
      & svg {
        color: #ffffff;
      }
    }
  }
  &:nth-child(5) {
    text-align: right;
    min-width: 100px;
  }
  &:nth-child(6) {
    text-align: left;
    min-width: 150px;
  }
  &:nth-child(7) {
    padding: 1.75px 5px;
    min-width: 30px;
    text-align: left;
  }
`

const InputTable = styled.input`
  max-width: 60px;
  background-color: #2d3136;
  border: none;
  outline: none;
  color: ${(props: { isPercentSumGood?: boolean }) =>
    props.isPercentSumGood ? '#fff' : '#f44336'};
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};

  & ${InputTable} {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3136' : '#393e44'};

    border: 1px solid #928282;
  }

  &:nth-child(even) {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }

  &:nth-child(even) ${InputTable} {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }
`

const Icon = styled.i`
  padding-right: 5px;
`

const ButtonsWrapper = styled.div`
  display: ${(props: { isEditModeEnabled?: boolean }) =>
    props.isEditModeEnabled ? 'block' : 'none'};
`

const ButtonsInnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Input = styled.input`
  box-sizing: border-box;
  border-bottom: 2px solid rgb(78, 216, 218);
  background: transparent;
  border-top: none;
  border-left: none;
  outline: none;
  border-right: none;
  width: 100%;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  padding: 10px 0 0;
  color: rgb(255, 255, 255);
`

const TableButton = styled.button`
  border: none;
  margin: 0;
  padding: 1.75px 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  text-align: inherit;
  outline: none;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &:hover {
    & svg {
      color: ${(props: { isDeleteColor?: boolean }) =>
        props.isDeleteColor ? '#4caf50' : '#f44336'};
    }
  }
  & svg {
    width: 18px;
    height: 18px;
  }
`

const ActionButton = styled.button`
  border: none;
  margin: 0;
  padding: 1.75px 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  text-align: inherit;
  outline: none;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  & svg {
    color: white;
    padding-bottom: 7px;
  }

  &:hover svg {
    color: #4ed8da;
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  min-width: 150px;
  justify-content: space-around;
  padding-left: 10px;

  & ${ActionButton} {
    visibility: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? 'visible' : 'hidden'};
  }
`

const Button = styled.button`
  border-radius: 2px;
  background-color: #4c5055;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  letter-spacing: 0.4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 10px;

  &:disabled {
    cursor: not-allowed;
    background-color: gray;
  }
`

const UndistributedMoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 120px;
`

const AddMoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 120px;
`

const UndistributedMoneyText = styled.p`
  font-family: Roboto, sans-serif;
  color: white;
  font-size: 14px;
  padding: 15px 0 5px;
  margin: 0;
`
const EditIconWrapper = styled.div`
  &:hover {
    color: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '#f44336' : '#4caf50'};
  }

  & svg {
    padding-bottom: ${(props: { isEditModeEnabled?: boolean }) =>
      props.isEditModeEnabled ? '4px' : '7px'};
  }
`

const SelectR = styled(SelectReact)`
  max-width: 100px;
  font-family: Roboto;
  font-size: 12px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 1px solid #fff;
  }

  & + & {
    margin-left: 25px;
  }
`

const Span = styled.span``

const Label = styled.label``


const Checkbox = styled.input`
  display: none;

  & + ${Label} ${Span} {
    display: inline-block;

    width: 18px;

    height: 18px;

    cursor: pointer;
    vertical-align: middle;

    border: 1.5px solid #909294;
    border-radius: 3px;
    background-color: transparent;
  }

  & + ${Label}:hover ${Span} {
    border-color: #4ed8da;
  }

  &:checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

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
