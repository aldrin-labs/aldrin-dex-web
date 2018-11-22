import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import nanoid from 'nanoid'
import Typography from '@material-ui/core/Typography'
import { fade } from '@material-ui/core/styles/colorManipulator'
import AddIcon from '@material-ui/icons/Add'

import {
  cloneArrayElementsOneLevelDeep,
  formatNumberToUSFormat,
  addMainSymbol,
} from '@utils/PortfolioTableUtils'
import { IProps, IState } from './RebalancedPortfolioTable.types'
import { exchangeOptions } from '.././mocks'
import SelectCoinList from '@components/SelectCoinList/SelectCoinList'
import SelectAllExchangeList from '@components/SelectAllExchangeList/SelectAllExchangeList'
import { handleRef } from '@components/ReactSelectComponent/utils'
import {
  InputTable,
  SDeleteIcon,
  LoaderInnerWrapper,
  LoaderWrapper,
  ContentInner,
} from './RebalancedPortfolioTable.styles'
import * as UTILS from '@utils/PortfolioRebalanceUtils'
import { IRow } from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'
import { TableWithSort, Table as ImTable } from '@storybook-components/index'
import { Loading } from '@components/Loading'
import { IconButtonWithHover } from '../Rebalance.styles'

export default class RebalancedPortfolioTable extends React.Component<
  IProps,
  IState
> {
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
      totalTableRows: parseFloat(newTableTotalRows).toFixed(2),
    })
  }

  handleSelectChange = (
    idx: number,
    name: string,
    optionSelected?: { label: string; value: string } | null
  ) => {
    const { rows, updateState } = this.props
    const value =
      optionSelected && !Array.isArray(optionSelected)
        ? optionSelected.value
        : ''
    const clonedRows = rows.map((a: IRow) => ({ ...a }))

    const resultRows = [
      ...clonedRows.slice(0, idx),
      {
        ...clonedRows[idx],
        [name]: value,
      },
      ...clonedRows.slice(idx + 1, clonedRows.length),
    ]

    updateState({
      rows: resultRows,
    })
  }

  onAddRowButtonClick = () => {
    const clonedRows = cloneArrayElementsOneLevelDeep(this.props.rows)
    const { totalRows, staticRows, updateState } = this.props
    const newRow = {
      _id: nanoid(),
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
            price: '0.00',
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

  transformData = (
    rows: IRow[],
    staticRows: IRow[],
    staticRowsMap,
    isEditModeEnabled: boolean,
    isPercentSumGood: boolean,
    red: string,
    green: string,
    background: string
  ) => {
    const isUSDCurrently = this.props.isUSDCurrently
    const transformedData = rows.map((row, index) => {
      const portfolioPercentage = isEditModeEnabled ? (
        <InputTable
          background={background}
          key={`inputPercentage${index}`}
          tabIndex={index + 1}
          isPercentSumGood={isPercentSumGood}
          value={rows[index].portfolioPerc}
          onChange={(e) => this.onPercentInputChange(e, index)}
          onBlur={(e) => this.onBlurPercentInput(e, index)}
          onFocus={(e) => this.onFocusPercentInput(e, index)}
          red={red}
        />
      ) : (
        `${row.portfolioPerc}%`
      )

      const exchange =
        isEditModeEnabled && row.editable ? (
          <SelectAllExchangeList
            key={`inputNameExchange${index}`}
            classNamePrefix="custom-select-box"
            isClearable={true}
            isSearchable={true}
            openMenuOnClick={true}
            options={exchangeOptions}
            menuPortalTarget={document.body}
            menuPortalStyles={{
              zIndex: 111,
            }}
            menuStyles={{
              fontSize: '12px',
              minWidth: '150px',
              height: '200px',
            }}
            menuListStyles={{
              height: '200px',
            }}
            optionStyles={{
              fontSize: '12px',
            }}
            clearIndicatorStyles={{
              padding: '2px',
            }}
            valueContainerStyles={{
              minWidth: '35px',
              maxWidth: '55px',
              overflow: 'hidden',
            }}
            inputStyles={{
              marginLeft: '0',
            }}
            onChange={(
              optionSelected: { label: string; value: string } | null
            ) => this.handleSelectChange(index, 'exchange', optionSelected)}
            noOptionsMessage={() => `No such exchange in our DB found`}
          />
        ) : (
          row.exchange
        )

      const coin =
        isEditModeEnabled && row.editable ? (
          <SelectCoinList
            ref={handleRef}
            key={`inputCoinSymbol${index}`}
            classNamePrefix="custom-select-box"
            isClearable={true}
            isSearchable={true}
            openMenuOnClick={false}
            menuPortalTarget={document.body}
            menuPortalStyles={{
              zIndex: 111,
            }}
            menuStyles={{
              fontSize: '12px',
              minWidth: '150px',
              height: '200px',
            }}
            menuListStyles={{
              height: '200px',
            }}
            optionStyles={{
              fontSize: '12px',
            }}
            clearIndicatorStyles={{
              padding: '2px',
            }}
            valueContainerStyles={{
              minWidth: '35px',
              maxWidth: '55px',
              overflow: 'hidden',
            }}
            inputStyles={{
              marginLeft: '0',
            }}
            dropdownIndicatorStyles={{
              display: 'none',
            }}
            noOptionsMessage={() => `No such coin in our DB found`}
            onChange={(
              optionSelected: { label: string; value: string } | null
            ) => this.handleSelectChange(index, 'symbol', optionSelected)}
          />
        ) : (
          row.symbol
        )

      return {
        id: index,
        exchange: { render: exchange },
        coin: { render: coin, style: { fontWeight: 700 } },
        ...(staticRowsMap.has(row._id)
          ? {
              oririnalPortfolioPerc: {
                contentToSort: +staticRowsMap.get(row._id).portfolioPerc,
                render: `${staticRowsMap.get(row._id).portfolioPerc}%`,
                isNumber: true,
              },
              oritinalPrice: {
                contentToSort: +staticRowsMap.get(row._id).price,
                render: addMainSymbol(
                  staticRowsMap.get(row._id).price,
                  isUSDCurrently
                ),
                isNumber: true,
              },
            }
          : {
              oririnalPortfolioPerc: { render: ' ', isNumber: true },
              oritinalPrice: { render: ' ', isNumber: true },
            }),
        portfolioPerc: {
          render: portfolioPercentage,
          isNumber: true,
          contentToSort: row.portfolioPerc === null ? 0 : +row.portfolioPerc,
        },
        price: {
          contentToSort: +row.price,
          render: addMainSymbol(
            formatNumberToUSFormat(row.price),
            isUSDCurrently
          ),
          isNumber: true,
        },
        deltaPrice: {
          render:
            +row.deltaPrice && row.deltaPrice > 0
              ? `BUY ${row.symbol}  $ ${formatNumberToUSFormat(row.deltaPrice)}`
              : +row.deltaPrice && row.deltaPrice < 0
              ? `SELL ${row.symbol}  $ ${formatNumberToUSFormat(
                  Math.abs(parseFloat(row.deltaPrice))
                )}`
              : '',
          color: row.deltaPrice > 0 ? green : red,
        },
        ...(isEditModeEnabled
          ? {
              deleteIcon: {
                render: (
                  <IconButtonWithHover
                    hoverColor={red}
                    onClick={() => this.onDeleteRowClick(index)}
                  >
                    <SDeleteIcon />
                  </IconButtonWithHover>
                ),
              },
            }
          : null),
      }
    })

    return transformedData
  }

  putDataInTable = () => {
    const {
      rows,
      staticRows,
      staticRowsMap,
      isUSDCurrently,
      isEditModeEnabled,
      totalStaticRows,
      totalRows,
      totalTableRows,
      totalPercents,
      theme,
      isPercentSumGood,
    } = this.props
    const { transformData } = this
    const red = theme.palette.red.main
    const green = theme.palette.green.main
    const background = theme.palette.background.default

    let columnNames = [
      { label: 'Exchange', id: 'exchange' },
      { label: 'Coin', id: 'coin' },
      { label: 'Current %', isNumber: true, id: 'oririnalPortfolioPerc' },
      {
        label: `Current ${isUSDCurrently ? 'USD' : 'BTC'}`,
        isNumber: true,
        id: 'oritinalPrice',
      },
      { label: 'Rebalanced %', isNumber: true, id: 'portfolioPerc' },
      {
        label: `Rebalanced ${isUSDCurrently ? 'USD' : 'BTC'}`,
        isNumber: true,
        id: 'price',
      },
      { label: 'Trade', id: 'deltaPrice' },
    ]
    //  space for delete icon
    if (isEditModeEnabled) {
      columnNames = [...columnNames, { label: '  ', id: 'deleteIcon' }]
    }

    return {
      columnNames,
      data: {
        body: transformData(
          rows,
          staticRows,
          staticRowsMap,
          isEditModeEnabled,
          isPercentSumGood,
          red,
          green,
          background
        ),
        footer: [
          isEditModeEnabled
            ? {
                id: '3',
                exchange: {
                  render: ' ',
                },
                coin: {
                  render: ' ',
                },
                current: {
                  render: ' ',
                },
                currentUSD: {
                  render: ' ',
                },
                rebalanced: {
                  render: ' ',
                },
                rebalancedUSD: {
                  render: ' ',
                },
                trade: {
                  render: ' ',
                },
                icon: {
                  render: (
                    <IconButtonWithHover
                      onClick={this.onAddRowButtonClick}
                      hoverColor={green}
                    >
                      <AddIcon />
                    </IconButtonWithHover>
                  ),
                },
                options: {
                  static: true,
                  variant: 'body',
                },
              }
            : null,
          {
            id: '33',
            exchange: 'Subtotal',
            coin: ' ',
            current: ' ',
            currentUSD: ' ',
            rebalanced: { render: `${totalPercents}%`, isNumber: true },
            rebalancedUSD: {
              contentToSort: +totalTableRows,
              render: addMainSymbol(
                formatNumberToUSFormat(totalTableRows),
                isUSDCurrently
              ),
              isNumber: true,
            },
            trade: ' ',
            ...(isEditModeEnabled ? { render: ' ' } : {}),
          },

          {
            id: '333',
            exchange: 'All',
            coin: ' ',
            current: ' ',
            currentUSD: {
              contentToSort: +totalStaticRows,
              render: addMainSymbol(
                formatNumberToUSFormat(totalStaticRows),
                isUSDCurrently
              ),
              isNumber: true,
            },
            rebalanced: ' ',
            rebalancedUSD: {
              contentToSort: +totalRows,
              render: addMainSymbol(
                formatNumberToUSFormat(totalRows),
                isUSDCurrently
              ),
              isNumber: true,
            },
            trade: ' ',
            ...(isEditModeEnabled ? { render: ' ' } : {}),
          },
        ],
      },
    }
  }

  render() {
    const {
      selectedActive,
      isEditModeEnabled,
      theme,
      loading,
      onEditModeEnable,
    } = this.props
    const Table = isEditModeEnabled ? ImTable : TableWithSort
    return (
      <>
        {loading && (
          <LoaderWrapper background={fade(theme.palette.common.black, 0.7)}>
            <LoaderInnerWrapper>
              <Loading size={94} margin={'0 0 2rem 0'} />{' '}
              <Typography color="secondary" variant="h4">
                Saving rebalanced portfolio...
              </Typography>{' '}
            </LoaderInnerWrapper>{' '}
          </LoaderWrapper>
        )}
        <ContentInner>
          <Table
            actionsColSpan={2}
            actions={[
              {
                id: 1,
                icon: <EditIcon />,
                onClick: onEditModeEnable,
                color: 'secondary',
              },
            ]}
            title="Rebalanced portfolio"
            withCheckboxes={isEditModeEnabled}
            checkedRows={selectedActive}
            onChange={this.onSelectActiveBalance}
            onSelectAllClick={this.onSelectAllActive}
            showUpperFooter={isEditModeEnabled}
            {...this.putDataInTable()}
          />
        </ContentInner>
      </>
    )
  }
}
