import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { compose } from 'recompose'

import PieChart from '@components/PieChart'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import LineChart from '@components/LineChart'
import PortfolioTableSum from '../PortfolioTableSum'
import { MOCKS, TMP_LINE_CHART_MOCKS, combineToChart } from './mocks'
import {
  IPortfolio,
  Args,
} from '@containers/Portfolio/components/PortfolioTable/types'
import { IndProps } from '@containers/Portfolio/interfaces'
import sortIcon from '@icons/arrow.svg'
import {
  onSortStrings,
  roundUSDOff,
} from '../../../../../utils/PortfolioTableUtils'
import { IState } from './PortfolioTableIndustries.types'

const tableHeadings = [
  { name: 'Exchange', value: 'currency' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Industry', value: 'industry' },
  { name: 'Current', value: 'price' },
  { name: 'Portfolio performance', value: 'portfolioPerf' },
  { name: 'Industry performance', value: 'industryPerf' },
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
  }

  componentDidMount() {
    const { data, isShownMocks } = this.props

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

    const composeWithMocks = {
      ...portfolio,
      assets: portfolio!.assets!.concat(MOCKS),
    }

    this.setState({ portfolio: composeWithMocks }, () =>
      this.combineIndustryData(composeWithMocks)
    )

    this.setState({ activeKeys: this.props.checkboxes })
  }

  componentWillReceiveProps(nextProps: IndProps) {
    if (nextProps.data) {
      const { portfolio } = nextProps.data
      if (!portfolio || !portfolio.assets) {
        return
      }

      const composeWithMocks = {
        ...portfolio,
        assets: portfolio.assets.concat(MOCKS),
      }

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
          ? parseFloat(performance.usd).toFixed(2)
          : parseFloat(performance.btc).toFixed(2)

        // console.log(performance.usd);
        // console.log(performance.btc);
        console.log('ind: ', ind)

        const col = {
          currency: name || '-',
          symbol,
          industry: industryName || '-',
          price: mainPrice || 0,
          portfolioPerf: 0,
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
    if (!selectedRows || !industryData) {
      return defaultSelectedSum
    }

    let newReducedSum = {}

    if (selectedRows.length === industryData.length) {
      newReducedSum = {
        ...reducedSum,
        currency: 'All',
        symbol: '-',
        industry: '-',
      }
    } else if (selectedRows.length > 1) {
      newReducedSum = {
        ...reducedSum,
        currency: 'Selected',
        symbol: '-',
        industry: '-',
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

  genLineChart = () => {
    const { selectedRows, industryData } = this.state
    if (!selectedRows || !industryData) {
      return
    }
    const data = industryData.filter((o, i) => selectedRows.indexOf(i) >= 0)

    return data.map((item, i) => ({
      x: i + 1,
      y: i * 2,
      label: `${item.symbol} ${item.industry}`,
    }))
  }

  render() {
    const { isUSDCurrently, children } = this.props
    const { selectedRows, selectedSum, industryData, currentSort } = this.state
    const isSelectAll =
      (industryData &&
        selectedRows &&
        industryData.length === selectedRows.length) ||
      false

    const tableDataHasData = industryData
      ? Object.keys(industryData).length
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
      <PTWrapper tableData={!!tableDataHasData}>
        {children}
        <Container>
          <Wrapper>
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
                  {tableHeadings.map((heading) => {
                    const isSorted =
                      currentSort && currentSort.key === heading.value

                    return (
                      <PTH
                        key={heading.name}
                        onClick={() => this.onSortTable(heading.value)}
                        isSorted={isSorted}
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
                  industryData.map((row, idx) => {
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
                      (selectedRows && selectedRows.indexOf(idx) >= 0) || false

                    const cols = [
                      currency,
                      symbol,
                      industry,
                      [mainSymbol, `${roundUSDOff(price, isUSDCurrently)}`],
                      `${portfolioPerf}%`,
                      `${industryPerf}%`,
                    ]

                    return (
                      <PTR
                        key={`${currency}${symbol}`}
                        isSelected={isSelected}
                        onClick={() => this.onSelectBalance(idx)}
                      >
                        <PTD key="smt" isSelected={isSelected}>
                          {this.renderCheckbox(idx)}
                        </PTD>
                        {cols &&
                          cols.map((col, innerIdx) => {
                            if (col && !Array.isArray(col) && col.match(/%/g)) {
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
                      </PTR>
                    )
                  })}
              </PTBody>
              {selectedSum && selectedSum.currency ? (
                <PortfolioTableSum
                  selectedSum={selectedSum}
                  isUSDCurrently={this.props.isUSDCurrently}
                />
              ) : null}
            </PTable>
          </Wrapper>

          <LineChartContainer>
            <Heading>Industry Line Chart</Heading>
            <LineChart data={TMP_LINE_CHART_MOCKS} />
          </LineChartContainer>
        </Container>

        <PieChartContainer>
          <PieChartHeadingWrapper>
            <Heading>Industry Pie Chart</Heading>
          </PieChartHeadingWrapper>
          <PieChart data={combineToChart()} flexible={true} />
        </PieChartContainer>
      </PTWrapper>
    )
  }
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30vh;

  @media (max-height: 650px) {
    height: 50%;
    margin-bottom: 20px;
  }
`

const PieChartHeadingWrapper = styled.div`
  width: 200px;
  text-align: center;
  padding-bottom: 5px;
`

const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3% 0;
  width: 40vw;
  height: 40vh;
  margin: 0 auto;

  @media (max-height: 650px) {
    display: none;
  }
`

const Heading = styled.span`
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #fff;
`

const PTWrapper = styled.div`
  width: ${(props: { tableData?: boolean }) =>
    props.tableData ? 'calc(100% - 240px);' : '100%'};
  display: flex;
  flex-direction: column;
  margin: 24px;
  border-radius: 3px;
  background-color: #393e44;
  box-shadow: 0 2px 6px 0 #00000066;
  position: relative;
  height: calc(100vh - 140px);
`

const LineChartContainer = styled.div`
  background-color: #fff;
  padding: 1em;
  width: 30%;
  height: 100%;
  text-align: center;
  margin: 0 20px;

  @media (max-height: 650px) {
    display: none;
  }
  @media (max-width: 900px) {
    display: none;
  }
`

const Icon = styled.i`
  padding-right: 5px;
`

const Wrapper = styled.div`
  overflow-y: scroll;
  background-color: #393e44;
  margin-left: 20px;

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
  border-collapse: collapse;
  display: inline-block;
`

const PTBody = styled.tbody`
  display: table;
  border-bottom: 1px solid #fff;
`

const PTD = styled.td`
  color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#4ed8da' : '#fff'};

  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  padding: 1.75px 16px 1.75px 10px;
  overflow: hidden;
  white-space: nowrap;

  &:nth-child(1) {
    padding: 1.75px 10px;
  }

  &:nth-child(2) {
    min-width: 100px;
  }
  &:nth-child(3) {
    min-width: 70px;
  }
  &:nth-child(n + 4) {
    text-align: right;
    min-width: 100px;
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
  font-family: Roboto;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  padding-right: ${(props: { isSorted?: boolean }) =>
    props.isSorted ? '0' : '16px'};
  font-weight: 500;

  &:nth-child(1) {
    padding: 10px;
    text-align: left;
  }

  &:nth-child(2) {
    text-align: left;
    width: 100px;
  }
  &:nth-child(3) {
    width: 70px;
    text-align: left;
  }
  &:nth-child(n + 4) {
    width: 100px;
    text-align: right;
  }
`

const PTR = styled.tr`
  cursor: pointer;
  background-color: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? '#2d3136' : '#393e44'};
  &:nth-child(even) {
    background-color: ${(props: { isSelected?: boolean }) =>
      props.isSelected ? '#2d3a3a' : '#3a4e4e'};
  }
`

const PTHead = styled.thead`
  display: table;
  width: 100%;
  position: sticky;
  top: 0;

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

const mapStateToProps = (store: object) => ({
  isShownMocks: store.user.isShownMocks,
})

const storeComponent = connect(mapStateToProps)(PortfolioTableIndustries)

export default compose()(storeComponent)
