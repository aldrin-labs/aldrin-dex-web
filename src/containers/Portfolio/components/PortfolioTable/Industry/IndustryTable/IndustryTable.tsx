import React from 'react'
import { TableWithSort as Table } from '@storybook-components/index'
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
  const theme: Theme = useTheme()
  const [state, setState] = useLegacyState({ expandedRows: [] })
  const red = theme.palette.red.main
  const green = theme.palette.red.green

  const putDataInTable = (industryData: any) => {
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

  const onSelectAllClick = (
    e: Event | undefined | 'selectAll',
    industryData: ReadonlyArray<any>
  ) => {
    if ((e && e.target && e.target.checked) || e === 'selectAll') {
      setState({
        expandedRows: industryData
          ? industryData.map((n: any) => n && n.industry)
          : [],
      })
      return
    }
    setState({ expandedRows: [] })
  }

  return (
    <Query
      query={industryDataQuery}
      variables={{ baseCoin: 'USD' }}
      onCompleted={(data) => {
        if (state.expandedRows.length === 0) {
          const industryData = combineIndustryData(data, -100, red, green)
            .industryData
          onSelectAllClick('selectAll', industryData)
        }
      }}
    >
      {({ data, loading, error }) => {
        if (error) {
          return <ErrorFallback error={error} />
        }
        if (loading) {
          return <TableLoader />
        }

        const industryData = combineIndustryData(data, -100, red, green)
          .industryData

        return (
          <Table
            id="PortfolioIndustryTable"
            actionsColSpan={3}
            expandableRows={true}
            onChange={expandRow}
            onSelectAllClick={(e) => onSelectAllClick(e, industryData)}
            expandedRows={state.expandedRows}
            title={'Industry Performance'}
            {...putDataInTable(industryData)}
          />
        )
      }}
    </Query>
  )
}

export default IndustryTable
