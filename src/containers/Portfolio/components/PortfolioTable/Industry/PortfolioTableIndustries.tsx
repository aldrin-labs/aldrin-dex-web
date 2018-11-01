import * as React from 'react'
import { connect } from 'react-redux'
import { Grid } from '@material-ui/core'

import { Table, DonutChart } from '@storybook-components'
import { IndProps } from '@containers/Portfolio/interfaces'
import {
  combineIndustryData,
  onCheckBoxClick,
  onAllCheckBoxClick,
} from '@utils/PortfolioTableUtils'
import { IState } from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries.types'
import { queryRendererHoc } from '@components/QueryRenderer'
import { getPortfolioQuery } from '@containers/Portfolio/api'
import { Container, Wrapper, ChartWrapper } from './Industry.styles'
import EmptyTablePlaceholder from '@components/EmptyTablePlaceholder'

const tableHeadings = [
  { name: 'Industry', value: 'industry' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio', value: 'portfolioPerc' },
  {
    name: 'Portfolio performance',
    value: 'portfolioPerf',
    additionName: 'performance',
  },
  {
    name: 'Industry performance: 1W',
    value: 'industryPerf1Week',
    additionName: 'performance',
  },
  {
    name: '1M',
    value: 'industryPerf1Month',
    additionName: 'performance',
  },
  {
    name: '3M',
    value: 'industryPerf3Months',
    additionName: 'performance',
  },
  {
    name: '1Y',
    value: 'industryPerf1Year',
    additionName: 'performance',
  },
]

const getStateObj = ({ data, theme, filterValueSmallerThenPercentage = 0 }) => {
  const { chartData, industryData } = combineIndustryData(
    data,
    filterValueSmallerThenPercentage,
    theme.palette.red.main,
    theme.palette.green.main
  )

  return { chartData, industryData }
}

class PortfolioTableIndustries extends React.Component<IndProps, IState> {
  state: IState = {
    portfolio: null,
    industryData: null,
    chartData: null,
    currentSort: null,
    expandedRows: [],
  }

  static getDerivedStateFromProps(props, state) {
    const { data, theme, filterValueSmallerThenPercentage } = props

    return getStateObj({
      data,
      theme,
      filterValueSmallerThenPercentage,
    })
  }

  componentDidMount() {
    this.onSelectAllClick(undefined, true)
  }

  putDataInTable = () => {
    const { industryData } = this.state
    if (!industryData) return

    return {
      head: tableHeadings.map((heading, index: number) => ({
        render: heading.name,
        isNumber: index === 0 || index === 1 ? false : true,
      })),
      body: industryData,
    }
  }

  onSelectAllClick = (e: Event | undefined, selectAll = false) => {
    if ((e && e.target && e.target.checked) || selectAll) {
      this.setState((state) => ({
        expandedRows: state.industryData
          ? state.industryData.map((n: any, i: number) => i)
          : [],
      }))
      return
    }
    this.setState({ expandedRows: [] })
  }

  expandRow = (id: number) =>
    this.setState((prevState) => ({
      expandedRows: onCheckBoxClick(prevState.expandedRows, id),
    }))

  render() {
    const { baseCoin } = this.props
    const { industryData, chartData, expandedRows } = this.state

    const tableDataHasData = industryData
      ? !!Object.keys(industryData).length
      : false

    return (
      <EmptyTablePlaceholder isEmpty={!tableDataHasData}>
        <Container container={true} spacing={16}>
          <Grid item={true} xs={12} md={8}>
            <Wrapper>
              <Table
                expandableRows={true}
                onChange={this.expandRow}
                onSelectAllClick={this.onSelectAllClick}
                expandedRows={expandedRows}
                rows={this.putDataInTable()}
                title={`Industry Performance in ${baseCoin}`}
              />
            </Wrapper>
          </Grid>
          <Grid item={true} xs={12} md={4} style={{}}>
            <ChartWrapper>
              <DonutChart
                labelPlaceholder="Industries %"
                data={chartData}
                isSizeFlexible={true}
                colorLegend={true}
              />
            </ChartWrapper>
          </Grid>
        </Container>
      </EmptyTablePlaceholder>
    )
  }
}


export default queryRendererHoc({
    query: getPortfolioQuery,
    pollInterval: 5000,
    fetchPolicy: 'network-only',
})(PortfolioTableIndustries)

