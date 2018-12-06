import * as React from 'react'
import { Grid } from '@material-ui/core'
import Joyride from 'react-joyride'
import { connect } from 'react-redux'

import { TableWithSort as Table, DonutChart } from '@storybook-components/index'
import { IndProps } from '@containers/Portfolio/interfaces'
import {
  combineIndustryData,
  onCheckBoxClick,
} from '@utils/PortfolioTableUtils'
import { IState } from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries.types'
import { queryRendererHoc } from '@components/QueryRenderer'
import { getPortfolioQuery } from '@containers/Portfolio/api'
import { Container, Wrapper, ChartWrapper } from './Industry.styles'
import EmptyTablePlaceholder from '@components/EmptyTablePlaceholder'
import { portfolioIndustrySteps } from '@utils/joyrideSteps'
import * as actions from '@containers/User/actions'
import { withErrorFallback } from '@hoc/'

const tableHeadings = [
  { name: 'Industry', value: 'industry', id: 'industry' },
  { name: 'Coin', value: 'symbol', id: 'coin' },
  { name: 'Portfolio', value: 'portfolioPerc', id: 'portfolio' },
  // {
  //   name: 'Portfolio performance',
  //   value: 'portfolioPerf',
  //   additionName: 'performance',
  // },
  {
    name: 'Industry performance: 1W',
    value: 'industryPerf1Week',
    additionName: 'performance',
    id: 'industry1w',
  },
  {
    name: '1M',
    value: 'industryPerf1Month',
    additionName: 'performance',
    id: 'industry1m',
  },
  {
    name: '3M',
    value: 'industryPerf3Months',
    additionName: 'performance',
    id: 'industry3M',
  },
  {
    name: '1Y',
    value: 'industryPerf1Year',
    additionName: 'performance',
    id: 'industry1Y',
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
    run: true,
    key: 0,
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
      columnNames: tableHeadings.map((heading, index: number) => ({
        label: heading.name,
        id: heading.id,
        isNumber: index === 0 || index === 1 ? false : true,
      })),
      data: { body: industryData },
    }
  }

  onSelectAllClick = (e: Event | undefined, selectAll = false) => {
    if ((e && e.target && e.target.checked) || selectAll) {
      this.setState((state) => ({
        expandedRows: state.industryData
          ? state.industryData.map((n: any) => n && n.industry)
          : [],
      }))
      return
    }
    this.setState({ expandedRows: [] })
  }

  expandRow = (id: string) =>
    this.setState((prevState) => ({
      expandedRows: onCheckBoxClick(prevState.expandedRows, id),
    }))

  handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    )
      this.props.hideToolTip('Industry')
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const { baseCoin, theme } = this.props
    const { industryData, chartData, expandedRows } = this.state

    const tableDataHasData = industryData
      ? !!Object.keys(industryData).length
      : false

    return (
      <EmptyTablePlaceholder isEmpty={!tableDataHasData}>
        <>
          <Container container={true} spacing={16}>
            <Grid item={true} xs={12} md={8}>
              <Wrapper>
                <Table
                  id="PortfolioIndustryTable"
                  actionsColSpan={3}
                  expandableRows={true}
                  onChange={this.expandRow}
                  onSelectAllClick={this.onSelectAllClick}
                  expandedRows={expandedRows}
                  title={'Industry Performance'}
                  {...this.putDataInTable()}
                />
              </Wrapper>
            </Grid>
            <Grid item={true} xs={12} md={4}>
              <ChartWrapper>
                <DonutChart
                  labelPlaceholder="Industry %"
                  data={chartData}
                  colorLegend={true}
                />
              </ChartWrapper>
            </Grid>
          </Container>
          <Joyride
            steps={portfolioIndustrySteps}
            run={this.props.toolTip.portfolioIndustry}
            callback={this.handleJoyrideCallback}
            key={this.state.key}
            styles={{
              options: {
                backgroundColor: theme.palette.getContrastText(
                  theme.palette.primary.main),
                primaryColor: theme.palette.secondary.main,
                textColor: theme.palette.primary.main,
              },
              tooltip: {
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.fontSize,
              },
            }}
          />
        </>
      </EmptyTablePlaceholder>
    )
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  hideToolTip: (tab: string) => dispatch(actions.hideToolTip(tab)),
})

const mapStateToProps = (store) => ({
  toolTip: store.user.toolTip,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withErrorFallback(
    queryRendererHoc({
      query: getPortfolioQuery,
      pollInterval: 5000,
      fetchPolicy: 'network-only',
    })(PortfolioTableIndustries)
  )
)
