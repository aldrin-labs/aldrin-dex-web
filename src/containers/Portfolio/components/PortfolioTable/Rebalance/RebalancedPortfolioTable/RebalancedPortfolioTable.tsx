import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import AddIcon from '@material-ui/icons/Add'

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
import { handleRef } from '@components/ReactSelectComponent/utils'
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

// import { Wrapper, Table, TableHeading } from '../sharedStyles/sharedStyles'
import * as UTILS from '@utils/PortfolioRebalanceUtils'
import { IRow } from '@containers/Portfolio/components/PortfolioTable/Rebalance/Rebalance.types'
import styled from 'styled-components'
import { Table } from '@storybook-components'

// const usdHeadingForRebalanced = [
//   { name: 'Exchange', value: 'exchange' },
//   { name: 'Coin', value: 'symbol' },
//   { name: 'Portfolio %', value: 'portfolioPerc' },
//   { name: 'USD', value: 'price' },
//   { name: 'Trade', value: 'deltaPrice' },
// ]
//
// const btcHeadingForRebalanced = [
//   { name: 'Exchange', value: 'exchange' },
//   { name: 'Coin', value: 'symbol' },
//   { name: 'Portfolio %', value: 'portfolioPerc' },
//   { name: 'BTC', value: 'price' },
//   { name: 'Trade', value: 'deltaPrice' },
// ]

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
      totalTableRows: parseFloat(newTableTotalRows).toFixed(2),
    })
  }

  handleSelectChange = (
    idx: number,
    name: string,
    optionSelected?: { label: string; value: string } | null
  ) => {

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
  transformData = (rows, staticRows, mainSymbol, red, green, isEditModeEnabled, isPercentSumGood) => {

    const transformedData = rows.map((row, index) => {

      const portfolioPercentage = isEditModeEnabled ? <InputTable
        key={`inputPercentage${index}`}
        tabIndex={index + 1}
        isPercentSumGood={isPercentSumGood}
        value={rows[index].portfolioPerc}
        onChange={(e) =>
          this.onPercentInputChange(e, index)
        }
        onBlur={(e) =>
          this.onBlurPercentInput(e, index)
        }
        onFocus={(e) =>
          this.onFocusPercentInput(e, index)
        }
        red={red}
      /> : `${row.portfolioPerc}%`

      const exchange = (isEditModeEnabled && row.editable) ? <SelectAllExchangeList
          key={`inputNameExchange${index}`}
          classNamePrefix="custom-select-box"
          isClearable={true}
          isSearchable={true}
          openMenuOnClick={true}
          options={exchangeOptions}
          menuPortalTarget={document.body}
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
            maxWidth: '55px',
            overflow: 'hidden',
          }}
          inputStyles={{
            marginLeft: '0',
          }}
          onChange={(optionSelected: { label: string; value: string } | null) =>
            this.handleSelectChange(index, 'exchange', optionSelected)
          }
          noOptionsMessage={()=>`No such exchange in our DB found`}
        /> : row.exchange

      const coin = (isEditModeEnabled && row.editable) ? <SelectCoinList
        ref={handleRef}
      key={`inputCoinSymbol${index}`}
      classNamePrefix="custom-select-box"
      isClearable={true}
      isSearchable={true}
      openMenuOnClick={false}
      menuPortalTarget={document.body}
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
      maxWidth: '55px',
      overflow: 'hidden',
      }}
      inputStyles={{
      marginLeft: '0',
      }}
      dropdownIndicatorStyles={{
      display: 'none',
      }}
      noOptionsMessage={()=>`No such coin in our DB found`}
      onChange={(optionSelected: { label: string; value: string } | null) =>
      this.handleSelectChange(index, 'symbol', optionSelected)
      }
      /> : row.symbol

      return Object.values({
        exchange: {render: exchange},
        coin: { render: coin, style: { fontWeight: 700 } },
      ...(staticRows[index] ? {
        oririnalPortfolioPerc: {render: staticRows[index].portfolioPerc, isNumber: true },
        oritinalPrice: {render: staticRows[index].price, isNumber: true },
      } : {
        oririnalPortfolioPerc: {render: ' ', isNumber: true},
        oritinalPrice: {render: ' ', isNumber: true},
      }),
        portfolioPerc: { render: portfolioPercentage, isNumber: true },
        price: {
          additionalRender: mainSymbol,
          render: formatNumberToUSFormat(row.price),
          isNumber: true,
        },
        deltaPrice: {render: (+row.deltaPrice && row.deltaPrice > 0 ?
            `BUY ${row.symbol}  $ ${formatNumberToUSFormat(row.deltaPrice)}` :
            (+row.deltaPrice && row.deltaPrice < 0) ?
              `SELL ${row.symbol}  $ ${formatNumberToUSFormat(Math.abs(parseFloat(row.deltaPrice)))}`
              : ''), color: row.deltaPrice > 0 ? green : red},
      ...(isEditModeEnabled ? {
        deleteIcon: {render: <SDeleteIcon onClick={() => this.onDeleteRowClick(index)} hoverColor={red} />},
      } : {}),
      })
    })


    return transformedData
  }

  putDataInTable = () => {
    const { rows, staticRows, isUSDCurrently, isEditModeEnabled, totalStaticRows, totalRows, totalTableRows, totalPercents, theme, isPercentSumGood } = this.props
    const { transformData } = this
    const red = theme.palette.red.main
    const green = theme.palette.green.main
    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" />
    ) : (
      <Icon className="fa fa-btc" />
    )



    return {
      head: [
          { render: 'Exchange' },
          { render: 'Coin' },
          { render: 'Current %', isNumber: true },
          { render: `Current ${isUSDCurrently ? 'USD' : 'BTC'}`, isNumber: true },
          { render: 'Rebalanced %', isNumber: true },
          { render: `Rebalanced ${isUSDCurrently ? 'USD' : 'BTC'}`, isNumber: true },
          { render: 'Trade' },
        ...(isEditModeEnabled ? [{ render: ' ' }] : []),
      ],
      body: transformData(rows, staticRows, mainSymbol, red, green, isEditModeEnabled, isPercentSumGood),
      upperFooter: isEditModeEnabled ? [[
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        { render: <SAddIcon onClick={this.onAddRowButtonClick} hoverColor={green} /> },
        ]] : [[]],
      footer: [
        [
        'Subtotal',
        ' ',
          ' ',
          ' ',
        { render: `${totalPercents}%`, isNumber: true },
        {
          additionalRender: mainSymbol,
          render: formatNumberToUSFormat(totalTableRows),
          isNumber: true,
        },
        ' ',
        ...(isEditModeEnabled ? [{ render: ' ' }] : []),
      ],
        [
          'All',
          ' ',
          ' ',
          ' ',
          ' ',
          {
            additionalRender: mainSymbol,
            render: formatNumberToUSFormat(totalRows),
            isNumber: true,
          },
          ' ',
          ...(isEditModeEnabled ? [{ render: ' ' }] : []),
        ],
      ],
    }
  }

  // transformData = (staticRows, mainSymbol) => {
  //   const transformedData = staticRows.map((row) => {
  //     return Object.values({
  //       exchange: row.exchange,
  //       coin: { render: row.symbol, style: { fontWeight: 700 } },
  //       portfolioPerc: { render: `${row.portfolioPerc}%`, isNumber: true },
  //       price: {
  //         additionalRender: mainSymbol,
  //         render: formatNumberToUSFormat(row.price),
  //         isNumber: true,
  //       },
  //     })
  //   })
  //
  //   return transformedData
  // }
  //
  // putDataInTable = () => {
  //   const { staticRows, isUSDCurrently, totalStaticRows } = this.props
  //   const { transformData } = this
  //   const mainSymbol = isUSDCurrently ? (
  //     <Icon className="fa fa-usd" />
  //   ) : (
  //     <Icon className="fa fa-btc" />
  //   )
  //
  //   console.log('staticRows', staticRows)
  //
  //   return {
  //     head: [
  //       { render: 'exchange', isNumber: false },
  //       { render: 'coin', isNumber: false },
  //       { render: 'portfolio%', isNumber: true },
  //       { render: isUSDCurrently ? 'usd' : 'btc', isNumber: true },
  //     ],
  //     body: transformData(staticRows, mainSymbol),
  //     footer: [
  //       ' ',
  //       ' ',
  //       { render: '100%', isNumber: true },
  //       {
  //         additionalRender: mainSymbol,
  //         render: formatNumberToUSFormat(totalStaticRows),
  //         isNumber: true,
  //       },
  //     ],
  //   }
  // }



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
      theme: { palette },
    } = this.props

    // const textColor = palette.getContrastText(
    //   palette.background.paper
    // )
    // const background = palette.background.paper
    // const evenBackground = palette.action.hover
    // const secondary = palette.secondary.main
    // const red = palette.red.main
    // const green = palette.green.main
    //
    // const saveButtonColor =
    //   isPercentSumGood && undistributedMoney >= 0 ? green : red

    // const mainSymbol = isUSDCurrently ? (
    //   <Icon className="fa fa-usd" />
    // ) : (
    //     <Icon className="fa fa-btc" />
    //   )

    // const tableHeadingsRebalancedPortfolio = isUSDCurrently
    //   ? usdHeadingForRebalanced
    //   : btcHeadingForRebalanced

    // const coins =
    //   selectedActive && selectedActive.length > 0
    //     ? selectedActive.map((id: number) => rows[id])
    //     : []
    //
    // console.log('coins', coins);
    // console.log('tableData', rows);

    return (
      <TableWrapper>
        {/*<RebalanceActionButtons*/}
          {/*{...{*/}
            {/*isEditModeEnabled,*/}
            {/*saveButtonColor,*/}
            {/*onSaveClick,*/}
            {/*onEditModeEnable,*/}
            {/*onReset,*/}
            {/*secondary,*/}
            {/*red,*/}
            {/*green,*/}
          {/*}}*/}
        {/*/>*/}
        <Table
          title="Rebalanced portfolio"
          withCheckboxes={isEditModeEnabled}
          checkedRows={selectedActive}
          onChange={this.onSelectActiveBalance}
          onSelectAllClick={this.onSelectAllActive}
          showUpperFooter={isEditModeEnabled}
          rows={this.putDataInTable()}
        />
      </TableWrapper>
    )

    {/*<TableAndHeadingWrapper isEditModeEnabled={isEditModeEnabled} textColor={textColor}>*/}
        {/*<TableHeading>*/}
          {/*Rebalanced portfolio*/}
          {/*<RebalanceActionButtons*/}
            {/*{...{*/}
              {/*isEditModeEnabled,*/}
              {/*saveButtonColor,*/}
              {/*onSaveClick,*/}
              {/*onEditModeEnable,*/}
              {/*onReset,*/}
              {/*secondary,*/}
              {/*red,*/}
              {/*green,*/}
            {/*}}*/}
          {/*/>*/}
        {/*</TableHeading>*/}
        {/*<Wrapper>*/}
          {/*<Table>*/}
            {/*<PTHead*/}
              {/*isEditModeEnabled={isEditModeEnabled}*/}
              {/*bottomCollor={textColor}*/}
            {/*>*/}
              {/*<PTR*/}
                {/*evenBackground={background}*/}
                {/*background={background}*/}
              {/*>*/}
                {/*{isEditModeEnabled && (*/}
                  {/*<PTHR key="selectAll" style={{ textAlign: 'left' }}>*/}
                    {/*<Checkbox*/}
                      {/*onChange={this.onSelectAllActive}*/}
                      {/*checked={areAllActiveChecked}*/}
                      {/*type="checkbox"*/}
                      {/*id="selectAllActive"*/}
                    {/*/>*/}
                    {/*<Label htmlFor="selectAllActive">*/}
                      {/*<Span />*/}
                    {/*</Label>*/}
                  {/*</PTHR>*/}
                {/*)}*/}

                {/*{tableHeadingsRebalancedPortfolio.map((heading) => {*/}
                  {/*const isSorted =*/}
                    {/*currentSortForDynamic &&*/}
                    {/*currentSortForDynamic.key === heading.value*/}

                  {/*return (*/}
                    {/*<PTHR*/}
                      {/*key={heading.name}*/}
                      {/*onClick={() =>*/}
                        {/*onSortTable(heading.value, 'currentSortForDynamic')*/}
                      {/*}*/}
                    {/*>*/}
                      {/*{heading.name}*/}

                      {/*{isSorted && (*/}
                        {/*<ArrowDownward*/}
                          {/*style={{*/}
                            {/*fontSize: 16,*/}
                            {/*verticalAlign: 'middle',*/}
                            {/*marginLeft: '4px',*/}
                            {/*transform:*/}
                              {/*currentSortForDynamic &&*/}
                                {/*currentSortForDynamic.arg === 'ASC'*/}
                                {/*? 'rotate(180deg)'*/}
                                {/*: null,*/}
                          {/*}}*/}
                        {/*/>*/}
                      {/*)}*/}
                    {/*</PTHR>*/}
                  {/*)*/}
                {/*})}*/}

                {/*{isEditModeEnabled && <PTHR />}*/}
              {/*</PTR>*/}
            {/*</PTHead>*/}

            {/*<PTBody isEditModeEnabled={isEditModeEnabled}>*/}
              {/*{rows.map((row, rowIndex) => {*/}
                {/*const {*/}
                  {/*id,*/}
                  {/*exchange = '',*/}
                  {/*symbol = '',*/}
                  {/*portfolioPerc = 0,*/}
                  {/*price = 0,*/}
                  {/*deltaPrice = 0,*/}
                {/*} = row*/}

                {/*const isSelected =*/}
                  {/*(selectedActive && selectedActive.indexOf(id) >= 0) || false*/}

                {/*let deltaPriceString = ''*/}

                {/*if (deltaPrice && +deltaPrice) {*/}
                  {/*if (deltaPrice > 0) {*/}
                    {/*deltaPriceString = `BUY ${symbol}  $ ${formatNumberToUSFormat(*/}
                      {/*deltaPrice*/}
                    {/*)}`*/}
                  {/*} else {*/}
                    {/*deltaPriceString = `SELL ${symbol}  $ ${formatNumberToUSFormat(*/}
                      {/*Math.abs(parseFloat(deltaPrice))*/}
                    {/*)}`*/}
                  {/*}*/}
                {/*}*/}

                {/*const cols = [*/}
                  {/*exchange,*/}
                  {/*symbol || '',*/}
                  {/*portfolioPerc ? `${portfolioPerc}%` : '',*/}
                  {/*`${formatNumberToUSFormat(price)}`,*/}
                  {/*deltaPriceString,*/}
                {/*]*/}

                {/*return (*/}
                  {/*<PTR*/}
                    {/*key={`${rowIndex}`}*/}
                    {/*isSelected={isSelected}*/}
                    {/*background={background}*/}
                    {/*evenBackground={evenBackground}*/}
                    {/*selectedBackground={palette.background.default}*/}
                  {/*>*/}
                    {/*{isEditModeEnabled && (*/}
                      {/*<PTDR*/}
                        {/*key="smt"*/}
                        {/*isSelected={isSelected}*/}
                        {/*secondary={secondary}*/}
                        {/*onClick={() => this.onSelectActiveBalance(id)}*/}
                      {/*>*/}
                        {/*{this.renderActiveCheckbox(id)}*/}
                      {/*</PTDR>*/}
                    {/*)}*/}

                    {/*{cols.map((col, idx) => {*/}
                      {/*const isNewCoinName =*/}
                        {/*row.editable && idx === 0 && isEditModeEnabled*/}
                      {/*const isNewCoinSymbol =*/}
                        {/*row.editable && idx === 1 && isEditModeEnabled*/}

                      {/*if (isNewCoinName) {*/}
                        {/*return (*/}
                          {/*<PTDR key={`NameExchange${idx}`}>*/}
                            {/*<SelectAllExchangeList*/}
                              {/*key={`inputNameExchange${rowIndex}`}*/}
                              {/*classNamePrefix="custom-select-box"*/}
                              {/*isClearable={true}*/}
                              {/*isSearchable={true}*/}
                              {/*openMenuOnClick={true}*/}
                              {/*options={exchangeOptions}*/}
                              {/*menuPortalTarget={document.body}*/}
                              {/*menuStyles={{*/}
                                {/*fontSize: '12px',*/}
                                {/*minWidth: '150px',*/}
                                {/*height: '200px',*/}
                              {/*}}*/}
                              {/*menuListStyles={{*/}
                                {/*height: '200px',*/}
                              {/*}}*/}
                              {/*optionStyles={{*/}
                                {/*fontSize: '12px',*/}
                              {/*}}*/}
                              {/*clearIndicatorStyles={{*/}
                                {/*padding: '2px',*/}
                              {/*}}*/}
                              {/*valueContainerStyles={{*/}
                                {/*maxWidth: '55px',*/}
                                {/*overflow: 'hidden',*/}
                              {/*}}*/}
                              {/*inputStyles={{*/}
                                {/*marginLeft: '0',*/}
                              {/*}}*/}
                              {/*onChange={(optionSelected: { label: string; value: string } | null) =>*/}
                                {/*this.handleSelectChange(rowIndex, 'exchange', optionSelected)*/}
                              {/*}*/}
                              {/*noOptionsMessage={()=>`No such exchange in our DB found`}*/}
                            {/*/>*/}
                          {/*</PTDR>*/}
                        {/*)*/}
                      {/*}*/}

                      {/*if (isNewCoinSymbol) {*/}
                        {/*return (*/}
                          {/*<PTDR key={`CoinSymbol${idx}`}>*/}
                            {/*<SelectCoinList*/}
                              {/*ref={handleRef}*/}
                              {/*key={`inputCoinSymbol${rowIndex}`}*/}
                              {/*classNamePrefix="custom-select-box"*/}
                              {/*isClearable={true}*/}
                              {/*isSearchable={true}*/}
                              {/*openMenuOnClick={false}*/}
                              {/*menuPortalTarget={document.body}*/}
                              {/*menuStyles={{*/}
                                {/*fontSize: '12px',*/}
                                {/*minWidth: '150px',*/}
                                {/*height: '200px',*/}
                              {/*}}*/}
                              {/*menuListStyles={{*/}
                                {/*height: '200px',*/}
                              {/*}}*/}
                              {/*optionStyles={{*/}
                                {/*fontSize: '12px',*/}
                              {/*}}*/}
                              {/*clearIndicatorStyles={{*/}
                                {/*padding: '2px',*/}
                              {/*}}*/}
                              {/*valueContainerStyles={{*/}
                                {/*maxWidth: '55px',*/}
                                {/*overflow: 'hidden',*/}
                              {/*}}*/}
                              {/*inputStyles={{*/}
                                {/*marginLeft: '0',*/}
                              {/*}}*/}
                              {/*dropdownIndicatorStyles={{*/}
                                {/*display: 'none',*/}
                              {/*}}*/}
                              {/*noOptionsMessage={()=>`No such coin in our DB found`}*/}
                              {/*onChange={(optionSelected: { label: string; value: string } | null) =>*/}
                                {/*this.handleSelectChange(rowIndex, 'symbol', optionSelected)*/}
                              {/*}*/}
                            {/*/>*/}
                          {/*</PTDR>*/}
                        {/*)*/}
                      {/*}*/}

                      {/*if (idx === 2) {*/}
                        {/*if (!isEditModeEnabled) {*/}
                          {/*return (*/}
                            {/*<PTDR key={`${col}${idx}`}>*/}
                              {/*{col}*/}
                            {/*</PTDR>*/}
                          {/*)*/}
                        {/*}*/}

                        {/*return (*/}
                          {/*<PTDR key={`percentageInCont${idx}`}>*/}
                            {/*<InputTable*/}
                              {/*key={`inputPercentage${rowIndex}`}*/}
                              {/*tabIndex={rowIndex + 1}*/}
                              {/*isPercentSumGood={isPercentSumGood}*/}
                              {/*value={rows[rowIndex].portfolioPerc}*/}
                              {/*onChange={(e) =>*/}
                                {/*this.onPercentInputChange(e, rowIndex)*/}
                              {/*}*/}
                              {/*onBlur={(e) =>*/}
                                {/*this.onBlurPercentInput(e, rowIndex)*/}
                              {/*}*/}
                              {/*onFocus={(e) =>*/}
                                {/*this.onFocusPercentInput(e, rowIndex)*/}
                              {/*}*/}
                              {/*red={red}*/}
                            {/*/>*/}
                          {/*</PTDR>*/}
                        {/*)*/}
                      {/*}*/}
                      {/*if (col.match(/BUY/g)) {*/}
                        {/*const color = green*/}

                        {/*return (*/}
                          {/*<PTDR*/}
                            {/*key={`buy${idx}${col}${rowIndex}`}*/}
                            {/*style={{ color }}*/}
                          {/*>*/}
                            {/*{col}*/}
                          {/*</PTDR>*/}
                        {/*)*/}
                      {/*}*/}
                      {/*if (col.match(/SELL/g)) {*/}
                        {/*const color = red*/}

                        {/*return (*/}
                          {/*<PTDR*/}
                            {/*key={`sell${idx}${col}${rowIndex}`}*/}
                            {/*style={{ color }}*/}
                          {/*>*/}
                            {/*{col}*/}
                          {/*</PTDR>*/}
                        {/*)*/}
                      {/*}*/}

                      {/*if (idx === 3) {*/}
                        {/*return (*/}
                          {/*<PTDR key={`${col}${idx}`}>*/}
                            {/*{mainSymbol}*/}
                            {/*{col}*/}
                          {/*</PTDR>*/}
                        {/*)*/}
                      {/*}*/}

                      {/*return <PTDR key={`${col}${idx}`}>{col}</PTDR>*/}
                    {/*})}*/}
                    {/*<PTDR>*/}
                      {/*<TableButton*/}
                        {/*isDeleteColor={false}*/}
                        {/*onClick={() => this.onDeleteRowClick(rowIndex)}*/}
                        {/*red={red}*/}
                        {/*green={green}*/}
                      {/*>*/}
                        {/*<DeleteIcon />*/}
                      {/*</TableButton>*/}
                    {/*</PTDR>*/}
                  {/*</PTR>*/}
                {/*)*/}
              {/*})}*/}
              {/*{isEditModeEnabled && (*/}
                {/*<PTR*/}
                  {/*background={background}*/}
                  {/*evenBackground={evenBackground}*/}
                {/*>*/}
                  {/*<PTDR />*/}
                  {/*<PTDR />*/}
                  {/*<PTDR />*/}
                  {/*<PTDR />*/}
                  {/*<PTDR />*/}
                  {/*<PTDR />*/}
                  {/*<PTDR>*/}
                    {/*<TableButton*/}
                      {/*isDeleteColor={true}*/}
                      {/*onClick={this.onAddRowButtonClick}*/}
                      {/*red={red}*/}
                      {/*green={green}*/}
                    {/*>*/}
                      {/*<AddIcon />*/}
                    {/*</TableButton>*/}
                  {/*</PTDR>*/}
                {/*</PTR>*/}
              {/*)}*/}
            {/*</PTBody>*/}
            {/*<PTFoot isEditModeEnabled={isEditModeEnabled}>*/}
              {/*<PTR*/}
                {/*selectedBackground={palette.background.default}*/}
                {/*background={background}*/}
                {/*evenBackground={background}*/}
              {/*>*/}
                {/*{isEditModeEnabled && <PTHR style={{ width: '38px' }} />}*/}
                {/*<PTHR>Subtotal</PTHR>*/}
                {/*<PTHR>-</PTHR>*/}
                {/*<PTHR>{`${totalPercents}%`}</PTHR>*/}
                {/*<PTHR>*/}
                  {/*{mainSymbol}*/}
                  {/*{formatNumberToUSFormat(totalTableRows)}*/}
                {/*</PTHR>*/}
                {/*<PTHR>-</PTHR>*/}
                {/*<PTHR>-</PTHR>*/}
              {/*</PTR>*/}
              {/*<PTR*/}
                {/*selectedBackground={palette.background.default}*/}
                {/*background={background}*/}
                {/*evenBackground={background}*/}
              {/*>*/}
                {/*{isEditModeEnabled && <PTHR style={{ width: '38px' }} />}*/}
                {/*<PTHR>All</PTHR>*/}
                {/*<PTHR>-</PTHR>*/}
                {/*<PTHR>-</PTHR>*/}
                {/*<PTHR>*/}
                  {/*{mainSymbol}*/}
                  {/*{formatNumberToUSFormat(totalRows)}*/}
                {/*</PTHR>*/}
                {/*<PTHR>-</PTHR>*/}
                {/*<PTHR>-</PTHR>*/}
              {/*</PTR>*/}
            {/*</PTFoot>*/}
          {/*</Table>*/}
        {/*</Wrapper>*/}
        {/*<RebalanceMoneyButtons*/}
          {/*{...{*/}
            {/*isEditModeEnabled,*/}
            {/*addMoneyInputValue,*/}
            {/*undistributedMoney,*/}
            {/*staticRows,*/}
            {/*rows,*/}
            {/*selectedActive,*/}
            {/*updateState,*/}
            {/*secondary,*/}
            {/*red,*/}
            {/*green,*/}
          {/*}}*/}
        {/*/>*/}
      {/*</TableAndHeadingWrapper>*/}

  }
}


const TableWrapper = styled.div`
  width: 80%;
  display: flex;
`

const SAddIcon = styled(AddIcon)`
  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`

const SDeleteIcon = styled(DeleteIcon)`
  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`
