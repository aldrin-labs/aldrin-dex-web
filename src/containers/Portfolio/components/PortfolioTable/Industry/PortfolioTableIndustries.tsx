import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Table from '@components/Tables/WithCheckboxesAndSummary'

import { IndProps } from '@containers/Portfolio/interfaces'
import { customAquaScrollBar } from '@styles/cssUtils'
import { combineIndustryData } from '@utils/PortfolioTableUtils'
import { IState } from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries.types'
import { queryRendererHoc } from '@components/QueryRenderer'
import { getPortfolioQuery } from '@containers/Portfolio/api'
import { Paper, Grid } from '@material-ui/core'

import { DonutChart } from '@components/DonutChart'
import EmptyTablePlaceholder from '@components/EmptyTablePlaceholder'

const tableHeadings = [
  { name: 'Industry', value: 'industry' },
  { name: 'Coin', value: 'symbol' },
  { name: 'Portfolio %', value: 'portfolioPerc' },
  { name: 'Portfolio', value: 'portfolioPerf', additionName: 'performance' },
  {
    name: 'Industry: 1W',
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
        number: index === 0 || index === 1 ? false : true,
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
                title={`Industries Performance in ${baseCoin}`}
              />
            </Wrapper>
          </Grid>
          <Grid item={true} xs={12} md={4} style={{}}>
            <ChartWrapper elevation={8}>
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

const Container = styled(Grid)`
  && {
    height: calc(100vh - 80px);
    padding: 1rem 0;
    width: 100%;
  }
`

const ChartWrapper = styled(Paper)`
  max-height: 100%;
  height: 75%;
  width: 100%;
  ${customAquaScrollBar};
`

const Wrapper = styled(Paper)`
  max-height: 100%;
  display: flex;
  margin: 0 20px 5px;
  flex-direction: column;
  overflow-x: scroll;
  ${customAquaScrollBar};
`

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
