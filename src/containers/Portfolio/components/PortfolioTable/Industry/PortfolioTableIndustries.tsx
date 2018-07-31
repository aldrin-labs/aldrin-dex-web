import * as React from 'react'
import { connect } from 'react-redux'
import styled, {css} from 'styled-components'
import { compose } from 'recompose'

import SvgIcon from '@components/SvgIcon/SvgIcon'
import Switch from '@containers/Portfolio/components/PortfolioTable/Industry/SwitchWithIcons'
import {
  calcPercentage,
  calcAllSumOfPortfolioAsset,
} from '@utils/PortfolioTableUtils'
import LineChart from '@components/LineChart'
import PortfolioTableSum from '@containers/Portfolio/components/PortfolioTable/PortfolioTableSum'
import {
  MOCKS,
  genMocks,
  inds,
} from '@containers/Portfolio/components/PortfolioTable/Industry/mocks'
import {
  IPortfolio,
  Args,
} from '@containers/Portfolio/components/PortfolioTable/types'
import { IndProps } from '@containers/Portfolio/interfaces'
import sortIcon from '@icons/arrow.svg'
import { onSortStrings, roundUSDOff } from '@utils/PortfolioTableUtils'
import { IState } from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries.types'
import QueryRenderer from '@components/QueryRenderer'
import PieChartQuery from '@containers/Portfolio/components/PortfolioTable/Industry/PieChartQuery'
import { getPortfolioQuery } from '@containers/Portfolio/api'

const tableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Industry', value: 'industry' },
  { name: 'Current', value: 'price' },
  { name: 'Portfolio', value: 'portfolioPerf', additionName: 'performance' },
  { name: 'Industry', value: 'industryPerf', additionName: 'performance' },
]

const defaultSelectedSum = {
  currency: '',
  symbol: '',
  industry: '',
  price: 0,
  portfolioPerf: 0,
  industryPerf: 0,
}

class PortfolioTableIndustries extends React.Component<IndProps, IState> {
  state: IState = {
    activeKeys: null,
    portfolio: null,
    industryData: null,
    currentSort: null,
    selectedRows: null,
    selectedSum: defaultSelectedSum,
    activeLegend: null,
    showChart: 'line',
  }

  componentWillMount() {
    const lineChartMocks = genMocks(31, inds)
    this.setState({ lineChartMocks })
  }

  componentDidMount() {
    const {
      data: { getProfile: data },
      isShownMocks,
      switchToUsd,
    } = this.props
    switchToUsd()
    if (!data && isShownMocks) {
      this.setState({ portfolio: { assets: MOCKS } }, () =>
        this.combineIndustryData({ assets: MOCKS })
      )

      this.setState({ activeKeys: this.props.checkboxes })

      return
    } else if (!data) {
      return
    }
    const { portfolio } = data

    const composeWithMocks = isShownMocks
      ? {
          ...portfolio,
          assets: portfolio!.assets!.concat(MOCKS),
        }
      : portfolio

    this.setState({ portfolio: composeWithMocks }, () =>
      this.combineIndustryData(composeWithMocks)
    )

    this.setState({ activeKeys: this.props.checkboxes })
  }

  componentWillReceiveProps(nextProps: IndProps) {
    if (nextProps.data) {
      const { portfolio } = nextProps.data.getProfile
      const { isShownMocks } = nextProps

      if (!portfolio || !portfolio.assets) {
        return
      }

      const composeWithMocks = isShownMocks
        ? {
            ...portfolio,
            assets: portfolio.assets.concat(MOCKS),
          }
        : portfolio

      this.setState({ portfolio: composeWithMocks })
      this.combineIndustryData(composeWithMocks)
    }

    if (nextProps.checkboxes) {
      this.setState({ activeKeys: nextProps.checkboxes }, () =>
        this.combineIndustryData(this.state.portfolio)
      )
    }

    if (nextProps.checkboxes && nextProps.checkboxes.length === 0) {
      this.setState({ selectedRows: null, selectedSum: defaultSelectedSum })
    }

    if (nextProps.isUSDCurrently !== this.props.isUSDCurrently) {
      const { portfolio } = this.state
      this.combineIndustryData(portfolio)
    }
  }

  toggleChart = () => {
    this.setState((prevState: IState) => ({
      showChart: prevState.showChart === 'line' ? 'chart' : 'line',
    }))
  }

  combineIndustryData = (portfolio?: IPortfolio) => {
    const { isUSDCurrently } = this.props
    const { activeKeys } = this.state
    if (!portfolio || !portfolio.assets || !activeKeys) {
      return
    }
    const { assets } = portfolio

    const industryData = assets
      .map((row) => {
        const {
          asset = { symbol: '', priceBTC: '', priceUSD: '', industry: '' },
          key = { name: '' },
          exchange = { name: '' },
          value = 0,
        } =
          row || {}
        if (activeKeys.indexOf(key!.name) === -1) {
          return null
        }
        const {
          symbol = '',
          priceUSD = '',
          priceBTC = '',
          industry: ind = '',
        } =
          asset || {}
        const { name = '' } = exchange
        const { name: industryName, performance } = ind || {
          name: '',
          performance: {
            usd: 0,
            btc: 0,
          },
        }

        const mainPrice = isUSDCurrently ? priceUSD : priceBTC
        const industryPerformance = isUSDCurrently
          ? parseFloat(performance.usd ? performance.usd : 0).toFixed(2)
          : parseFloat(performance.btc ? performance.btc : 0).toFixed(2)

        const allSums = calcAllSumOfPortfolioAsset(assets, isUSDCurrently)

        const currentPrice = mainPrice * value

        const col = {
          currency: name || '-',
          symbol,
          industry: industryName || '-',
          price: mainPrice || 0,
          portfolioPerf: 0,
          portfolioPerc: calcPercentage(currentPrice * 100 / allSums),
          industryPerf: industryPerformance || 0,
        }

        return col
      })
      .filter(Boolean)

    this.setState({ industryData }, () =>
      this.calculateSum(this.state.selectedRows)
    )
  }

  renderCheckbox = (idx: number) => {
    const { selectedRows } = this.state
    const isSelected = (selectedRows && selectedRows.indexOf(idx) >= 0) || false

    return (
      <React.Fragment>
        <Checkbox
          type="checkbox"
          id={idx}
          defaultChecked={false}
          checked={isSelected}
        />
        <Label htmlFor={idx} onClick={(e) => e.preventDefault()}>
          <Span />
        </Label>
      </React.Fragment>
    )
  }

  onSortTable = (key: Args) => {
    const { industryData, currentSort } = this.state
    if (!industryData) {
      return
    }

    const stringKey =
      key === 'currency' || key === 'symbol' || key === 'industry'

    const newData = industryData.slice().sort((a, b) => {
      if (currentSort && currentSort.key === key) {
        if (currentSort.arg === 'ASC') {
          this.setState({ currentSort: { key, arg: 'DESC' } })

          if (stringKey) {
            return onSortStrings(b[key], a[key])
          }

          return b[key] - a[key]
        } else {
          this.setState({ currentSort: { key, arg: 'ASC' } })

          if (stringKey) {
            return onSortStrings(a[key], b[key])
          }

          return a[key] - b[key]
        }
      }
      this.setState({ currentSort: { key, arg: 'ASC' } })

      if (stringKey) {
        return onSortStrings(a[key], b[key])
      }

      return a[key] - b[key]
    })

    this.setState({ industryData: newData })
  }

  onSelectBalance = (idx: number) => {
    const selectedRows =
      (this.state.selectedRows && this.state.selectedRows.slice()) || []

    const hasIndex = selectedRows.indexOf(idx)
    if (hasIndex >= 0) {
      selectedRows.splice(hasIndex, 1)
    } else {
      selectedRows.push(idx)
    }

    this.setState({ selectedRows }, () => this.calculateSum(selectedRows))
  }

  calculateSum = (selectedRows: number[] | null) => {
    const { industryData } = this.state
    if (!selectedRows || !industryData) {
      this.setState({ selectedSum: defaultSelectedSum })

      return
    }

    const sum = industryData.filter((td, idx) => selectedRows.indexOf(idx) >= 0)
    const reducedSum = sum.reduce(
      (acc, val) => ({
        currency: val.currency,
        symbol: val.symbol,
        industry: val.industry,
        price: Number(acc.price) + Number(val.price),
        portfolioPerf: Number(acc.portfolioPerf) + Number(val.portfolioPerf),
        industryPerf: Number(acc.industryPerf) + Number(val.industryPerf),
      }),
      {
        currency: '',
        symbol: '',
        industry: '',
        price: 0,
        portfolioPerf: 0,
        industryPerf: 0,
      }
    )
    const validateSum = this.onValidateSum(reducedSum)

    this.setState({ selectedSum: validateSum })
  }

  onValidateSum = (reducedSum: { [key: string]: string | number }) => {
    const { selectedRows, industryData } = this.state
    const { isUSDCurrently } = this.props

    if (!selectedRows || !industryData) {
      return defaultSelectedSum
    }

    let newReducedSum = {}
    // TODO: SHOULD BE REFACTORED below
    const mainSymbol = isUSDCurrently ? (
      <Icon className="fa fa-usd" key="usd" />
    ) : (
      <Icon className="fa fa-btc" key="btc" />
    )
    // TODO: SHOULD BE REFACTORED above


    if (selectedRows.length === industryData.length) {
      newReducedSum = {
        ...reducedSum,
        currency: 'All',
        symbol: '-',
        industry: '-',
        price: [mainSymbol, reducedSum.price],
        portfolioPerf: `${reducedSum.portfolioPerf.toFixed(2)}%`,
        industryPerf: `${reducedSum.industryPerf.toFixed(2)}%`,
      }
    } else if (selectedRows.length >= 1) {
      newReducedSum = {
        ...reducedSum,
        currency: 'Selected',
        symbol: '-',
        industry: '-',
        price: [mainSymbol, reducedSum.price],
        portfolioPerf: `${reducedSum.portfolioPerf.toFixed(2)}%`,
        industryPerf: `${reducedSum.industryPerf.toFixed(2)}%`,
      }
    }

    return newReducedSum
  }

  onSelectAll = () => {
    const { industryData } = this.state
    if (!industryData) {
      return
    }
    const rowQuantity = industryData.length
    let allRows: number[] | null
    const selectedRows =
      (this.state.selectedRows && this.state.selectedRows.slice()) || []
    if (selectedRows.length !== rowQuantity) {
      allRows = industryData.map((td, i) => i)
    } else {
      allRows = null
    }
    this.setState({ selectedRows: allRows }, () => this.calculateSum(allRows))
  }

  onChangeData = (data: string[]) => {
    const lineChartMocks = genMocks(31, data)

    this.setState({ lineChartMocks })
  }

  render() {
    const {
      isUSDCurrently,
      children,
      filterValueSmallerThenPercentage,
    } = this.props
    const {
      selectedRows,
      selectedSum,
      industryData,
      currentSort,
      activeLegend,
    } = this.state
    const isSelectAll =
      (industryData &&
        selectedRows &&
        industryData.length === selectedRows.length) ||
      false


    console.log('isUSDCurrently ', isUSDCurrently);


    let isThereAnySelectedRows = false
    if (selectedRows) {
      isThereAnySelectedRows = selectedRows.length > 1
    }

    const tableDataHasData = industryData
      ? !!Object.keys(industryData).length
      : false

    if (!tableDataHasData) {
      return (
        <PTWrapper tableData={!!tableDataHasData}>
          {children}
          <PTextBox>Add account for Portfolio</PTextBox>
        </PTWrapper>
      )
    }

    return (
      <PTWrapper tableData={!!tableDataHasData} innerRef={this.setWrapperRef}>
        {children}
        <Container>
          <Wrapper
            isThereAnySelectedRows={isThereAnySelectedRows}
            innerRef={this.setChildNodeRef}
          >
            <PTable>
              <PTHead>
                <PTR>
                  <PTH key="selectAll">
                    <Checkbox
                      type="checkbox"
                      id="selectAll"
                      checked={isSelectAll}
                      onChange={this.onSelectAll}
                    />
                    <Label htmlFor="selectAll">
                      <Span />
                    </Label>
                  </PTH>
                  {tableHeadings.map((heading, index) => {
                    const isSorted =
                      currentSort && currentSort.key === heading.value

                    return (
                      <PTH
                        key={`${heading.name}${index}`}
                        onClick={() => this.onSortTable(heading.value)}
                        isSorted={isSorted}
                      >

                        {[4,5].includes(index) ? <>{heading.name} <br /> {heading.additionName}</> : heading.name }

                        {isSorted && (
                          <SvgIcon
                            src={sortIcon}
                            width={12}
                            height={12}
                            style={{
                              verticalAlign: 'middle',
                              marginLeft: '4px',
                              transform:
                                currentSort && currentSort.arg === 'ASC'
                                  ? 'rotate(180deg)'
                                  : null,
                            }}
                          />
                        )}
                      </PTH>
                    )
                  })}
                </PTR>
              </PTHead>

              <PTBody>
                {industryData &&
                  industryData
                    .filter(
                      (el) =>
                        el.portfolioPerc >
                        (filterValueSmallerThenPercentage
                          ? filterValueSmallerThenPercentage
                          : 0)
                    )
                    .map((row, idx) => {
                      const {
                        currency,
                        symbol,
                        industry,
                        price,
                        portfolioPerf,
                        industryPerf,
                      } = row

                      const mainSymbol = isUSDCurrently ? (
                        <Icon className="fa fa-usd" key={`${idx}usd`} />
                      ) : (
                        <Icon className="fa fa-btc" key={`${idx}btc`} />
                      )

                      const isSelected =
                        (selectedRows && selectedRows.indexOf(idx) >= 0) ||
                        false

                      const priceFormattedBTC = roundUSDOff(price, isUSDCurrently)
                      const priceFormattedUSD = parseFloat(roundUSDOff(price, isUSDCurrently)).toLocaleString('en-US')
                      const formattedPrice = isUSDCurrently ? priceFormattedUSD : priceFormattedBTC

                      const cols = [
                        currency,
                        symbol,
                        industry,
                        [mainSymbol, formattedPrice],
                        `${portfolioPerf}%`,
                        `${industryPerf}%`,
                      ]


                      return (
                        <PTRBody
                          key={`${currency}${symbol}${idx}`}
                          isSelected={isSelected}
                          onClick={() => this.onSelectBalance(idx)}
                        >
                          <PTD key="smt" isSelected={isSelected}>
                            {this.renderCheckbox(idx)}
                          </PTD>
                          {cols &&
                            cols.map((col, innerIdx) => {
                              if (
                                col &&
                                !Array.isArray(col) &&
                                col.match(/%/g)
                              ) {
                                const color =
                                  Number(col.replace(/%/g, '')) >= 0
                                    ? '#65c000'
                                    : '#ff687a'

                                return (
                                  <PTD
                                    key={`${col}${innerIdx}`}
                                    style={{ color }}
                                    isSelected={isSelected}
                                  >
                                    {col}
                                  </PTD>
                                )
                              }

                              return (
                                <PTD
                                  key={`${col}${innerIdx}`}
                                  isSelected={isSelected}
                                >
                                  {col}
                                </PTD>
                              )
                            })}
                        </PTRBody>
                      )
                    })}
              </PTBody>
              {selectedSum && selectedSum.currency ? (
                <PortfolioTableSum
                  industry={true}
                  selectedSum={selectedSum}
                  isUSDCurrently={this.props.isUSDCurrently}
                />
              ) : null}
            </PTable>
          </Wrapper>
          <ChartContainer>
            <Heading pieChart={this.state.showChart === 'chart'}>
              <Switch onClick={this.toggleChart} />
            </Heading>
            <ChartWrapper>
              {this.state.showChart === 'line' ? (
                <LineChart
                  data={this.state.lineChartMocks}
                  activeLine={activeLegend}
                  onChangeData={this.onChangeData}
                />
              ) : (
                // <PieChart data={genAngleMocks(inds)} flexible />
                <PieChartQuery isShownMocks={this.props.isShownMocks} />
              )}
            </ChartWrapper>
          </ChartContainer>
        </Container>
      </PTWrapper>
    )
  }
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 20px 20px;

  @media (max-width: 2000px) {
    align-items: center;
    flex-direction: column;
  }
`

const HeadingForPieChart = css`
  position: absolute;
  z-index: 2;
  right: 16px;
`

const Heading = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #fff;
  
    ${(props: { pieChart?: boolean }) =>
  props.pieChart ? HeadingForPieChart : ''};
`

const PTWrapper = styled.div`
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 2rem)' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 130px);
  overflow: auto;
`

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  //height: 25vh;
  display: flex;
  position: relative;

  //@media (max-height: 850px) {
  //  height: 20vh;
  //}
`

const ChartContainer = styled.div`
  border-radius: 3px;
  background-color: #2d3136;
  box-shadow: 0 2px 6px 0 #0006;
  position: relative;
  padding: 1em;
  text-align: center;
  height: 35vh;

  width: 720px;

  @media (max-width: 2000px) {
    height: 30vh;
  }

  @media (max-height: 940px) {
    height: 30vh;
  }

  @media (max-height: 680px) {
    display: none;
  }
  @media (max-width: 850px) {
    display: none;
  }
`

const Icon = styled.i`
  padding-right: 5px;
`

const Wrapper = styled.div`
  overflow-y: scroll;
  border-radius: 3px;
  background-color: ${(props: { isThereAnySelectedRows?: boolean }) =>
    props.isThereAnySelectedRows ? 'transparent' : '#2d3136;'};
  box-shadow: 0 10px 30px 0 rgb(45, 49, 54);
  max-height: 35vh;
  margin-right: 50px;
  //width: 900px;

  @media (max-width: 2000px) {
    margin-right: 0;
    margin-bottom: 30px;
  }

  @media (max-height: 850px) {
    max-height: 25vh;
  }

  @media (max-height: 680px) {
    max-height: 50vh;
  }

  @media (max-height: 550px) {
    max-height: 45vh;
  }

  @media (max-height: 460px) {
    max-height: 40vh;
  }

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }
`

const PTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  display: inline-block;
`

const PTBody = styled.tbody`
  display: table;
  width: 100%;
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 0 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;
  min-width: 100px;

  &:nth-child(1) {
    min-width: 30px;
    padding: 1.75px 10px;
  }

  &:nth-child(2) {
    min-width: 90px;
      text-overflow: ellipsis;
  }

  &:nth-child(3) {
    min-width: 60px;
      text-overflow: ellipsis;
  }

  &:nth-child(n + 4) {
    text-align: right;
  }

  &:nth-child(4) {
    min-width: 200px;
    max-width: 200px;
      text-overflow: ellipsis;
  }

  &:nth-child(7) {
    min-width: 120px;
    padding-right: 16px;
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

  & :checked + ${Label} ${Span} {
    border-color: #4ed8da;
    background-color: #4ed8da;
    background-image: url('https://image.flaticon.com/icons/png/128/447/447147.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 14px;
  }
`

const PTH = styled.th`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  padding: 1.75px 0 1.75px 10px;
  font-weight: 500;
  min-width: 100px;
  user-select: none;

  &:nth-child(1) {
    min-width: 30px;
  }
  &:nth-child(2) {
    min-width: 90px;
  }

  &:nth-child(3) {
    min-width: 60px;
  }

  &:nth-child(1) {
    padding: 10px;
    text-align: left;
  }

  &:nth-child(2) {
    text-align: left;
  }

  &:nth-child(3) {
    text-align: left;
  }

  &:nth-child(n + 4) {
    text-align: right;
  }

  &:nth-child(4) {
    min-width: 200px;
  }

  &:nth-child(7) {
    min-width: 120px;
    padding-right: 16px;
  }
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
`

const PTRBody = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? 'rgba(57, 62, 68, 1)' : 'rgba(45, 49, 54, 1)'};

  &:nth-child(odd) {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }

  &:hover {
    background-color: rgba(70, 102, 142, 0.2);
  }
`

const PTHead = styled.thead`
  display: table;
  position: sticky;
  top: 0;
  width: 100%;

  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
  }
`

const PTextBox = styled.div`
  font-size: 30px;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3136;
`

class MainDataWrapper extends React.Component {
  render() {
    return (
      <QueryRenderer
        component={PortfolioTableIndustries}
        query={getPortfolioQuery}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (store: object) => ({
  isShownMocks: store.user.isShownMocks,
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

const storeComponent = connect(mapStateToProps)(MainDataWrapper)

export default compose()(storeComponent)
