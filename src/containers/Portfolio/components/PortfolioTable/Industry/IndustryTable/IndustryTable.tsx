import React, { useEffect } from 'react'
import { Table } from '@storybook-components/index'
import useLegacyState from 'use-legacy-state'
import {
  combineIndustryData,
  onCheckBoxClick,
} from '@utils/PortfolioTableUtils'
import { tableHeadings } from './config'
import { Query } from 'react-apollo'
import { getPortfolioQuery as industryDataQuery } from '@containers/Portfolio/api'
import { ErrorFallback } from '@storybook-components/ErrorFallback'
import TableLoader from '@components/TablePlaceholderLoader/newLoader'
import { Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

interface State {
  expandedRows: ReadonlyArray<number>
  industryData: any
}

const IndustryTable = () => {
  const theme = useTheme()
  const [state, setState] = useLegacyState({ expandedRows: [] })
  const red = theme.palette.red.main
  const green = theme.palette.red.green

  const putDataInTable = (data: any) => {
    const industryData = combineIndustryData(data, -100, red, green)
      .industryData
    console.log(industryData)
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

  const expandRow = (id: string) =>
    setState((prevState: State) => ({
      expandedRows: onCheckBoxClick(prevState.expandedRows, id),
    }))

  const onSelectAllClick = (e: Event | undefined, selectAll = false) => {
    if ((e && e.target && e.target.checked) || selectAll) {
      setState((prevState: State) => ({
        expandedRows: prevState.industryData
          ? prevState.industryData.map((n: any) => n && n.industry)
          : [],
      }))
      return
    }
    setState({ expandedRows: [] })
  }

  return (
    <Query query={industryDataQuery} variables={{ baseCoin: 'USD' }}>
      {({ data, loading, error }) => {
        if (error) {
          return <ErrorFallback error={error} />
        }
        if (loading) {
          return <TableLoader />
        }

        return (
          <Table
            id="PortfolioIndustryTable"
            actionsColSpan={3}
            expandableRows={true}
            onChange={expandRow}
            onSelectAllClick={onSelectAllClick}
            expandedRows={state.expandedRows}
            title={'Industry Performance'}
            {...putDataInTable(data)}
          />
        )
      }}
    </Query>
  )
}

export default IndustryTable
