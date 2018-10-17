import * as React from 'react'
import { connect } from 'react-redux'
import { Grid } from '@material-ui/core'

import Table from '@components/Tables/WithCheckboxesAndSummary'
import { IndProps } from '@containers/Portfolio/interfaces'
import { combineIndustryData } from '@utils/PortfolioTableUtils'
import { IState } from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries.types'
import { queryRendererHoc } from '@components/QueryRenderer'
import { getPortfolioQuery } from '@containers/Portfolio/api'
import { Container, Wrapper, ChartWrapper } from './Industry.styles'
import { DonutChart } from '@components/DonutChart'
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
    activeKeys: null,
    portfolio: null,
    industryData: null,
    chartData: null,
    currentSort: null,
    expandedRow: NaN,
  }

  static getDerivedStateFromProps(props, state) {
    const { data, theme, filterValueSmallerThenPercentage } = props

    return getStateObj({
      data,
      theme,
      filterValueSmallerThenPercentage,
    })
  }

  putDataInTable = () => {
    const { industryData } = this.state
    if (!industryData) return

    return {
      head: tableHeadings.map((heading, index: number) => ({
        text: heading.name,
        isNumber: index === 0 || index === 1 ? false : true,
      })),
      body: industryData,
    }
  }

  expandRow = (e: React.ChangeEvent, index: number) => {
    this.setState((prevState) => {
      return { expandedRow: index === prevState.expandedRow ? NaN : index }
    })
  }

  render() {
    const { baseCoin } = this.props
    const { industryData, chartData } = this.state

    const tableDataHasData = industryData
      ? !!Object.keys(industryData).length
      : false

    return (
      <EmptyTablePlaceholder isEmpty={!tableDataHasData}>
        <Container container={true} spacing={16}>
          <Grid item={true} xs={12} md={8}>
            <Wrapper elevation={8}>
              <Table
                onChange={this.expandRow}
                expandedRow={this.state.expandedRow}
                rows={this.putDataInTable()}
                title={`Industry Performance in ${baseCoin}`}
              />
            </Wrapper>
          </Grid>
          <Grid item={true} xs={12} md={4} style={{}}>
            <ChartWrapper elevation={8}>
              {console.log(chartData)}
              <DonutChart
                labelPlaceholder="Industries %"
                radius={150}
                thickness={15}
                data={chartData}
              />
            </ChartWrapper>
          </Grid>
        </Container>
      </EmptyTablePlaceholder>
    )
  }
}

const mapStateToProps = (store: object) => ({
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

export default connect(mapStateToProps)(
  queryRendererHoc({
    query: getPortfolioQuery,
    pollInterval: 5000,
    fetchPolicy: 'network-only',
  })(PortfolioTableIndustries)
)
