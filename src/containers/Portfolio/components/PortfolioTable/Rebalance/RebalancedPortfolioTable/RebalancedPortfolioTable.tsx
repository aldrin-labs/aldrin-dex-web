import React from 'react'
import nanoid from 'nanoid'
import { Theme } from '@material-ui/core'

import { IProps, IState } from './RebalancedPortfolioTable.types'
import { IRow } from '@core/types/PortfolioTypes'

import * as UTILS from '@core/utils/PortfolioRebalanceUtils'
import {
  cloneArrayElementsOneLevelDeep,
  formatNumberToUSFormat,
  roundAndFormatNumber,
} from '@core/utils/PortfolioTableUtils'

import { exchangeOptions } from './config'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import SelectAllExchangeList from '@core/components/SelectAllExchangeList/SelectAllExchangeList'
import { handleRef } from '@storybook/components/ReactSelectComponent/utils'

import {
  PortfolioRebalanceTable,
  addMainSymbol,
  TooltipCustom,
  IconButtonWithHover,
  DeleteIcon,
  AddIcon,
  Slider,
} from '@storybook/components/index'

export default class RebalancedPortfolioTable extends React.Component<
  IProps,
  IState
> {
  onPercentSliderDragEnd = (idx: number) => {
    const {
      rows,
      totalRows,
      undistributedMoney,
      updateState,
      totalSnapshotRows,
      totalPercents,
    } = this.props

    if (
      !(
        totalPercents > 100 ||
        (100 - +totalPercents < 0.5 &&
          (+rows[idx].portfolioPerc !== 0 || +rows[idx].portfolioPerc > 0.5))
      )
    ) {
      return
    }
    const clonedRows = rows.map((a: IRow) => ({ ...a }))
    const percentInput = 100 - +totalPercents
    const percentInputAfter = roundAndFormatNumber(
      +clonedRows[idx].portfolioPerc + percentInput,
      6,
      false
    )
    const {
      totalPercentsNew,
      rowWithNewPriceDiff,
      isPercentSumGood,
      newUndistributedMoney,
      newTableTotalRows,
    } = UTILS.recalculateAfterInputChange({
      clonedRows,
      rows,
      undistributedMoney,
      idx,
      totalRows,
      totalSnapshotRows,
      percentInput: percentInputAfter,
    })

    updateState({
      totalPercents: totalPercentsNew,
      rows: rowWithNewPriceDiff,
      isPercentSumGood: isPercentSumGood,
      undistributedMoney: newUndistributedMoney,
      totalTableRows: newTableTotalRows,
    })
  }

  onPercentSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: number,
    idx: number
  ) => {
    const {
      rows,
      totalRows,
      undistributedMoney,
      updateState,
      totalSnapshotRows,
      totalPercents,
    } = this.props

    const percentInput = value

    if (100 - +totalPercents < 0.5 && percentInput > rows[idx].portfolioPerc) {
      return
    }

    const clonedRows = rows.map((a: IRow) => ({ ...a }))
    const {
      totalPercentsNew,
      rowWithNewPriceDiff,
      isPercentSumGood,
      newUndistributedMoney,
      newTableTotalRows,
    } = UTILS.recalculateAfterInputChange({
      clonedRows,
      rows,
      undistributedMoney,
      idx,
      totalRows,
      totalSnapshotRows,
      percentInput,
    })

    updateState({
      totalPercents: totalPercentsNew,
      rows: rowWithNewPriceDiff,
      isPercentSumGood: isPercentSumGood,
      undistributedMoney: newUndistributedMoney,
      totalTableRows: newTableTotalRows,
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
    const { totalRows, updateState } = this.props
    const newRow = {
      _id: nanoid(),
      exchange: 'Exchange',
      symbol: 'Coin',
      portfolioPerc: 0.0,
      deltaPrice: 0,
      price: 0,
      isCustomAsset: true,
      priceSnapshot: null,
      percentSnapshot: null,
    }
    clonedRows.push(newRow)
    const rows = UTILS.calculatePriceDifference(
      UTILS.calculatePercents(clonedRows, `${totalRows}`)
    )
    const totalPercents = UTILS.calculateTotalPercents(rows)

    updateState({ rows, totalPercents, areAllActiveChecked: false })
  }

  onDeleteRowClick = (idx: number) => {
    const {
      rows,
      undistributedMoney,
      updateState,
      totalSnapshotRows,
    } = this.props
    const clonedRows = rows.map((a) => ({ ...a }))
    const currentRowMoney = clonedRows[idx].price
    const isEditableCoin = clonedRows[idx].isCustomAsset

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

    const newUndistributedMoney =
      parseFloat(`${undistributedMoney}`) + parseFloat(currentRowMoney)

    const newTotalRows = UTILS.calculateTotal(
      resultRows,
      `${newUndistributedMoney}`
    )
    const newTableTotalRows = UTILS.calculateTableTotal(resultRows)
    const newRowsWithNewPercents = UTILS.calculatePriceDifference(
      UTILS.calculatePercents(resultRows, newTotalRows)
    )
    const totalPercents = UTILS.calculateTotalPercents(newRowsWithNewPercents)

    const newIsPercentSumGood = UTILS.checkEqualsOfTwoTotals(
      newTableTotalRows,
      totalSnapshotRows
    )

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
    staticRowsMap: Map<string, string>,
    isEditModeEnabled: boolean,
    isPercentSumGood: boolean,
    red: string,
    green: string,
    background: string,
    fontFamily: string,
    showZerosForRebalancedPartIfItsEqualToCurrent: boolean,
    totalPercents: number | string,
    theme: Theme
  ) => {
    const isUSDCurrently = this.props.isUSDCurrently

    const transformedData = rows.map((row, index) => {
      const portfolioPercentage = (
        <TooltipCustom
          title={row.portfolioPerc}
          component={UTILS.preparePercentage(row.portfolioPerc)}
          withSpan={true}
        />
      )

      const trackAfterBackground =
        (100 - +totalPercents < 0.5 && +row.portfolioPerc < 0.5) ||
        (+row.portfolioPerc > 0.5 && 100 - +totalPercents === 0)
          ? ''
          : theme.palette.secondary.main
      const trackAfterOpacity = trackAfterBackground ? 1 : '0.24'
      const thumbBackground = 'rgba(255,129,0)'

      const SliderInput = (
        <Slider
          disabled={!isEditModeEnabled}
          trackAfterBackground={trackAfterBackground}
          trackAfterOpacity={trackAfterOpacity}
          thumbBackground={thumbBackground}
          trackBeforeBackground={theme.palette.getContrastText(
            theme.palette.primary.main
          )}
          key={row._id}
          value={row.portfolioPerc === null ? 0 : +row.portfolioPerc}
          max={100}
          step={0.5}
          onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => {
            this.onPercentSliderChange(e, value, index)
          }}
          onDragEnd={() => this.onPercentSliderDragEnd(index)}
        />
      )

      const shouldWeShowPlaceholderForExchange =
        row.exchange === '' || row.exchange === 'Exchange'

      const exchange =
        isEditModeEnabled && row.isCustomAsset ? (
          <SelectAllExchangeList
            key={`inputNameExchange${index}`}
            value={
              shouldWeShowPlaceholderForExchange
                ? null
                : [{ value: row.exchange, label: row.exchange }]
            }
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

      const shouldWeShowPlaceholderForCoin =
        row.symbol === '' || row.symbol === 'Coin'

      const coin =
        isEditModeEnabled && row.isCustomAsset ? (
          <SelectCoinList
            value={
              shouldWeShowPlaceholderForCoin
                ? null
                : [{ value: row.symbol, label: row.symbol }]
            }
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

      const percentSnapshot =
        row.percentSnapshot === null ? 0 : row.percentSnapshot
      const priceSnapshot = row.priceSnapshot === null ? 0 : row.priceSnapshot

      return {
        id: index,
        exchange: {
          render: exchange,
          ...(isEditModeEnabled ? { style: { minWidth: '125px' } } : {}),
        },
        coin: {
          render: coin,
          ...(isEditModeEnabled
            ? { style: { fontWeight: 700, minWidth: '125px' } }
            : { style: { fontWeight: 700 } }),
        },
        ...(staticRowsMap.has(row._id)
          ? {
              oririnalPortfolioPerc: {
                contentToSort: +staticRowsMap.get(row._id).portfolioPerc,
                render: (
                  <TooltipCustom
                    title={staticRowsMap.get(row._id).portfolioPerc}
                    component={UTILS.preparePercentage(
                      staticRowsMap.get(row._id).portfolioPerc
                    )}
                    withSpan={true}
                  />
                ),
                isNumber: true,
              },
              oritinalPrice: {
                contentToSort: +staticRowsMap.get(row._id).price,
                render: addMainSymbol(
                  roundAndFormatNumber(staticRowsMap.get(row._id).price, 2),
                  isUSDCurrently
                ),
                isNumber: true,
                style: { borderRight: '1px solid white' },
              },
            }
          : {
              oririnalPortfolioPerc: { render: '-', isNumber: true },
              oritinalPrice: {
                render: '-',
                isNumber: true,
                style: { borderRight: '1px solid white' },
              },
            }),
        ...(showZerosForRebalancedPartIfItsEqualToCurrent
          ? {
              percentSnapshot: 0,
              priceSnapshot: 0,
              portfolioPerc: 0,
              sliderPerc: ' ',
              price: 0,
            }
          : {
              percentSnapshot: {
                contentToSort: percentSnapshot,
                render: row.isCustomAsset ? (
                  '-'
                ) : (
                  <TooltipCustom
                    title={percentSnapshot}
                    component={UTILS.preparePercentage(percentSnapshot)}
                    withSpan={true}
                  />
                ),
                isNumber: true,
              },
              priceSnapshot: {
                contentToSort: priceSnapshot,
                render: row.isCustomAsset
                  ? '-'
                  : addMainSymbol(
                      roundAndFormatNumber(priceSnapshot, 2, true),
                      isUSDCurrently
                    ),
                isNumber: true,
              },
              portfolioPerc: {
                render: portfolioPercentage,
                isNumber: true,
                contentToSort:
                  row.portfolioPerc === null ? 0 : row.portfolioPerc,
              },
              sliderPerc: {
                render: SliderInput,
                style: {
                  minWidth: '10rem',
                },
              },
              price: {
                contentToSort: +row.price,
                render: addMainSymbol(
                  roundAndFormatNumber(row.price, 2, true),
                  isUSDCurrently
                ),
                isNumber: true,
              },
            }),
        deltaPrice: {
          render:
            +row.deltaPrice &&
            row.deltaPrice > 0 &&
            Math.abs(+row.deltaPrice) >= 0.01
              ? `BUY ${row.symbol}  $ ${roundAndFormatNumber(
                  row.deltaPrice,
                  2
                )}`
              : +row.deltaPrice &&
                row.deltaPrice < 0 &&
                Math.abs(+row.deltaPrice) >= 0.01
              ? `SELL ${row.symbol}  $ ${roundAndFormatNumber(
                  Math.abs(parseFloat(row.deltaPrice)),
                  2
                )}`
              : '',
          color: row.deltaPrice > 0 ? green : red,
          style: {
            minWidth: '10rem',
          },
        },
        ...(isEditModeEnabled
          ? {
              deleteIcon: {
                render: (
                  <IconButtonWithHover
                    data-e2e="deleteAssetButton"
                    component={<DeleteIcon />}
                    hoverColor={red}
                    onClick={() => this.onDeleteRowClick(index)}
                  />
                ),
              },
            }
          : {}),
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
      fontFamily,
      totalSnapshotRows,
    } = this.props
    const { transformData } = this
    const red = theme.customPalette.red.main
    const green = theme.customPalette.green.main
    const background = theme.palette.primary.main

    const showZerosForRebalancedPartIfItsEqualToCurrent =
      !isEditModeEnabled &&
      rows.length === staticRows.length &&
      rows.every((row, index) => row.price === staticRows[index].price)

    const columnNames = [
      { label: 'Exchange', id: 'exchange' },
      { label: 'Coin', id: 'coin' },
      { label: 'Current %', isNumber: true, id: 'oririnalPortfolioPerc' },
      {
        label: `Current ${isUSDCurrently ? 'USD' : 'BTC'}`,
        isNumber: true,
        id: 'oritinalPrice',
        style: { borderRight: '1px solid white' },
      },
      { label: 'Snapshot %', isNumber: true, id: 'percentSnapshot' },
      {
        label: `Snapshot ${isUSDCurrently ? 'USD' : 'BTC'}`,
        isNumber: true,
        id: 'priceSnapshot',
      },
      { label: 'Rebalanced %', isNumber: true, id: 'portfolioPerc' },
      { label: 'Slider %', id: 'sliderPerc' },
      {
        label: `Rebalanced ${isUSDCurrently ? 'USD' : 'BTC'}`,
        isNumber: true,
        id: 'price',
      },
      { label: 'Trade', id: 'deltaPrice' },
      ...(isEditModeEnabled
        ? [
            {
              label: '  ',
              id: 'deleteIcon',
            },
          ]
        : []),
    ]

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
          background,
          fontFamily,
          showZerosForRebalancedPartIfItsEqualToCurrent,
          totalPercents,
          theme
        ),
        footer: [
          ...(isEditModeEnabled
            ? [
                {
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
                    style: { borderRight: '1px solid white' },
                  },
                  percentSnapshot: {
                    render: ' ',
                  },
                  priceSnapshot: {
                    render: ' ',
                  },
                  rebalanced: {
                    render: ' ',
                  },
                  sliderPerc: {
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
                        id="addAssetButton"
                        onClick={this.onAddRowButtonClick}
                        hoverColor={green}
                        component={<AddIcon />}
                      />
                    ),
                  },
                  options: {
                    static: true,
                    variant: 'body',
                  },
                },
              ]
            : []),
          {
            id: '33',
            exchange: 'Subtotal',
            coin: ' ',
            current: ' ',
            currentUSD: {
              render: ' ',
              style: { borderRight: '1px solid white' },
            },
            percentSnapshot: {
              render: ' ',
            },
            priceSnapshot: {
              render: ' ',
            },
            ...(showZerosForRebalancedPartIfItsEqualToCurrent
              ? {
                  rebalanced: ' ',
                  sliderPerc: ' ',
                  rebalancedUSD: ' ',
                }
              : {
                  rebalanced: {
                    render: `${UTILS.prepareTotal(
                      parseFloat(`${totalPercents}`)
                    )}%`,
                    isNumber: true,
                  },
                  sliderPerc: {
                    render: `${roundAndFormatNumber(
                      100 - +totalPercents,
                      3,
                      false
                    )}%`,
                    isNumber: true,
                  },
                  rebalancedUSD: {
                    contentToSort: +totalTableRows,
                    render: addMainSymbol(
                      formatNumberToUSFormat(totalTableRows),
                      isUSDCurrently
                    ),
                    isNumber: true,
                  },
                }),
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
              style: { borderRight: '1px solid white' },
            },
            percentSnapshot: {
              render: ' ',
            },
            ...(showZerosForRebalancedPartIfItsEqualToCurrent
              ? {
                  priceSnapshot: ' ',
                  sliderPerc: ' ',
                  rebalanced: ' ',
                  rebalancedUSD: ' ',
                }
              : {
                  priceSnapshot: {
                    render: addMainSymbol(
                      formatNumberToUSFormat(totalSnapshotRows),
                      isUSDCurrently
                    ),
                    isNumber: true,
                  },
                  rebalanced: { render: '100.0%', isNumber: true },
                  sliderPerc: {
                    render: ' ',
                  },
                  rebalancedUSD: {
                    contentToSort: +totalRows,
                    render: addMainSymbol(
                      formatNumberToUSFormat(totalRows),
                      isUSDCurrently
                    ),
                    isNumber: true,
                  },
                }),
            trade: ' ',
            ...(isEditModeEnabled ? { render: ' ' } : {}),
          },
        ],
      },
    }
  }

  render() {
    const {
      isEditModeEnabled,
      theme,
      loading,
      onEditModeEnable,
      onReset,
      onSaveClick,
      red,
      onDiscardChanges,
      saveButtonColor,
      timestampSnapshot,
      onNewSnapshot,
    } = this.props

    const tableData = this.putDataInTable()

    return (
      <PortfolioRebalanceTable
        {...{
          tableData,
          isEditModeEnabled,
          theme,
          loading,
          onEditModeEnable,
          onReset,
          onSaveClick,
          red,
          onDiscardChanges,
          saveButtonColor,
          timestampSnapshot,
          onNewSnapshot,
        }}
      />
    )
  }
}
