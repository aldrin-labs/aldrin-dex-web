import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import Replay from '@material-ui/icons/Replay'
import ClearIcon from '@material-ui/icons/Clear'
import SnapshotIcon from '@material-ui/icons/Camera'
import nanoid from 'nanoid'
import Typography from '@material-ui/core/Typography'
import { fade } from '@material-ui/core/styles/colorManipulator'
import AddIcon from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'

import {
  cloneArrayElementsOneLevelDeep,
  formatNumberToUSFormat,
  roundAndFormatNumber,
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
  TitleContainer,
  TitleItem,
  StyledSlider,
} from './RebalancedPortfolioTable.styles'
import * as UTILS from '@utils/PortfolioRebalanceUtils'
import { IRow } from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'
import {
  TableWithSort,
  Table as ImTable,
  addMainSymbol,
} from '@storybook/components/index'
import { Loading } from '@components/Loading'
import { IconButtonWithHover } from '../Rebalance.styles'
import { Grow } from '@material-ui/core'

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

  onPercentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const {
      rows,
      totalRows,
      undistributedMoney,
      updateState,
      totalSnapshotRows,
    } = this.props
    const percentInput = e.target.value

    if (
      !/^([0-9]\.[0-9]{1,6}|[0-9]\.?|(!?[1-9][0-9]\.[0-9]{1,6}|[1-9][0-9]\.?)|100|100\.?|100\.[0]{1,6}?|)$/.test(
        percentInput
      )
    ) {
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
    const { totalRows, staticRows, updateState } = this.props
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
      UTILS.calculatePercents(clonedRows, totalRows)
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
      parseFloat(undistributedMoney) + parseFloat(currentRowMoney)

    const newTotalRows = UTILS.calculateTotal(resultRows, newUndistributedMoney)
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
    theme
  ) => {
    const isUSDCurrently = this.props.isUSDCurrently

    const transformedData = rows.map((row, index) => {
      const portfolioPercentage = (
        <Tooltip title={row.portfolioPerc} enterDelay={250} leaveDelay={200}>
          <span>{UTILS.preparePercentage(row.portfolioPerc)}</span>
        </Tooltip>
      )

      const trackAfterBackground =
        (100 - +totalPercents < 0.5 && +row.portfolioPerc < 0.5) ||
        (+row.portfolioPerc > 0.5 && 100 - +totalPercents === 0)
          ? ''
          : theme.palette.secondary.main
      const trackAfterOpacity = trackAfterBackground ? 1 : '0.24'
      const thumbBackground = 'rgba(255,129,0)'

      const SliderInput = (
        <StyledSlider
          classes={{
            trackAfter: 'trackAfter',
            trackBefore: 'trackBefore',
            thumb: 'thumb',
          }}
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
          onChange={(e, value) => {
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
                  <Tooltip
                    title={staticRowsMap.get(row._id).portfolioPerc}
                    enterDelay={250}
                    leaveDelay={200}
                  >
                    <span>
                      {UTILS.preparePercentage(
                        staticRowsMap.get(row._id).portfolioPerc
                      )}
                    </span>
                  </Tooltip>
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
                  <Tooltip
                    title={percentSnapshot}
                    enterDelay={250}
                    leaveDelay={200}
                  >
                    <span>{UTILS.preparePercentage(percentSnapshot)}</span>
                  </Tooltip>
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
                    hoverColor={red}
                    onClick={() => this.onDeleteRowClick(index)}
                  >
                    <SDeleteIcon />
                  </IconButtonWithHover>
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
                      >
                        <AddIcon />
                      </IconButtonWithHover>
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
                    render: `${UTILS.prepareTotal(totalPercents)}%`,
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
      selectedActive,
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
            id="PortfolioRebalanceTable"
            rowsWithHover={false}
            actionsColSpan={2}
            actions={[
              ...(!isEditModeEnabled
                ? [
                    {
                      id: 1,
                      icon: (
                        <Tooltip
                          title={`Rebalance portfolio`}
                          enterDelay={250}
                          leaveDelay={200}
                        >
                          <EditIcon id="editButton" />
                        </Tooltip>
                      ),
                      onClick: onEditModeEnable,
                      color: 'secondary',
                      style: { color: saveButtonColor, marginRight: '7px' },
                    },
                  ]
                : []),
              ...(isEditModeEnabled
                ? [
                    {
                      id: 2,
                      icon: (
                        <Tooltip
                          title={`Update snapshot`}
                          enterDelay={250}
                          leaveDelay={200}
                        >
                          <SnapshotIcon id="snapshotButton" />
                        </Tooltip>
                      ),
                      onClick: onNewSnapshot,
                      style: { color: '#fff', marginRight: '7px' },
                    },
                    {
                      id: 3,
                      icon: (
                        <Tooltip
                          title={`Discard changes`}
                          enterDelay={250}
                          leaveDelay={200}
                        >
                          <ClearIcon id="discardChangesButton" />
                        </Tooltip>
                      ),
                      onClick: onDiscardChanges,
                      style: { color: red, marginRight: '7px' },
                    },
                    {
                      id: 4,
                      icon: (
                        <Tooltip
                          title={`Reset to initial portfolio`}
                          enterDelay={250}
                          leaveDelay={200}
                        >
                          <Replay id="resetButton" />
                        </Tooltip>
                      ),
                      onClick: onReset,
                      style: { marginRight: '7px' },
                    },
                    {
                      id: 'random',
                      icon: (
                        <Tooltip
                          title={`Save changes`}
                          enterDelay={250}
                          leaveDelay={200}
                        >
                          <SaveIcon id="saveButton" />
                        </Tooltip>
                      ),
                      onClick: onSaveClick,
                      color: saveButtonColor,
                      style: { color: saveButtonColor, marginRight: '7px' },
                    },
                  ]
                : []),
            ]}
            title={
              <TitleContainer>
                <TitleItem>Rebalanced Portfolio</TitleItem>
                <Grow in={timestampSnapshot}>
                  <TitleItem>
                    {`Snapshot time:${timestampSnapshot &&
                      timestampSnapshot.format('MM-DD-YYYY h:mm:ss A')}`}
                  </TitleItem>
                </Grow>
              </TitleContainer>
            }
            checkedRows={selectedActive}
            onChange={this.onSelectActiveBalance}
            onSelectAllClick={this.onSelectAllActive}
            {...this.putDataInTable()}
          />
        </ContentInner>
      </>
    )
  }
}
