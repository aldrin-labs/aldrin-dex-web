import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Table from '@components/Tables/WithCheckboxesAndSummary'

import { IndProps } from '@containers/Portfolio/interfaces'
import { customAquaScrollBar } from '@styles/cssUtils'
import {
  onSortStrings,
  roundAndFormatNumber,
  combineIndustryData,
  roundPercentage,
} from '@utils/PortfolioTableUtils'
import { IState } from '@containers/Portfolio/components/PortfolioTable/Industry/PortfolioTableIndustries.types'
import { QueryRendererHoc } from '@components/QueryRenderer'
import { getPortfolioQuery } from '@containers/Portfolio/api'
import { PTWrapper } from '../Main/PortfolioTableBalances/PortfolioTableBalances.styles'
import { Paper, Grid, Card, CardContent } from '@material-ui/core'

import { DonutChart } from '@components/DonutChart'

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


class PortfolioTableIndustries extends React.Component<IndProps, IState> {
  state: IState = {
    activeKeys: null,
    portfolio: null,
    industryData: null,
    currentSort: null,
    expandedRow: NaN,
  }

  componentDidMount() {
    const { data, switchToUsd } = this.props
    console.log('data', data)
    switchToUsd()
    this.setState({ industryData: combineIndustryData(data) })
  }

  putDataInTable = () => {
    const { industryData } = this.state
    if (!industryData) return
    return {
      head: tableHeadings.map((heading, ind: number) => ({
        text: heading.name,
        number: ind === 0 || ind === 1 ? false : true,
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
    const { children, theme, filterValueSmallerThenPercentage } = this.props
    const { industryData } = this.state

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
      <Container container={true} spacing={8}>
        <Grid item={true} xs={12} md={8}>
          <Wrapper elevation={8}>
            <Table
              onChange={this.expandRow}
              expandedRow={this.state.expandedRow}
              rows={this.putDataInTable()}
              title="Industries Performance in %"
            />
          </Wrapper>
        </Grid>
        <Grid item={true} xs={12} md={4}>
          <ChartWrapper>
            <CardContentWrapper>
              <DonutChart
                width={300}
                height={300}
                radius={150}
                thickness={15}
//                data={chartCoins} 
              />
            </CardContentWrapper>
          </ChartWrapper>
        </Grid>
      </Container>
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

const ChartWrapper = styled(Card)`
  text-align: center;
`

const CardContentWrapper = styled(CardContent)`
  display: inline-block;
`

const Wrapper = styled(Paper)`
  max-height: 100%;
  display: flex;
  margin: 0 20px 5px;
  flex-direction: column;
  overflow-x: scroll;
  ${customAquaScrollBar};
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
`

const mapStateToProps = (store: object) => ({
  filterValueSmallerThenPercentage: store.portfolio.filterValuesLessThenThat,
})

export default connect(mapStateToProps)(
  QueryRendererHoc({
    query: getPortfolioQuery,
  })(PortfolioTableIndustries)
)
