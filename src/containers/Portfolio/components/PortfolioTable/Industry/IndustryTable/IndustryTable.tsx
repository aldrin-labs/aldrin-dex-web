import React, { useRef, useState } from 'react'
import { TableWithSort as Table } from '@storybook-components/index'
import {
  onCheckBoxClick,
} from '@utils/PortfolioTableUtils'
import { Query, Mutation } from 'react-apollo'
import { ErrorFallback } from '@storybook-components/ErrorFallback'
import { Theme } from '@material-ui/core'

import { combineIndustryData } from './utils'
import TableLoader from '@components/TablePlaceholderLoader/newLoader'
import { useTheme } from '@material-ui/styles'
import { getPortfolioQuery as industryDataQuery } from '@containers/Portfolio/api'
import { tableHeadings } from './config'
import { updateIndustries } from '@graphql/mutations/portfolio/updateIndustries'

const IndustryTable = () => {
  const theme: Theme = useTheme()
  const [expandedRows, setExpandedRows] = useState([])
  const red = theme.customPalette.red.main
  const green = theme.customPalette.green.main

  const mountedRef = useRef(false)

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
    setExpandedRows(onCheckBoxClick(expandedRows, id) as never[])

  const onSelectAllClick = (
    e: React.ChangeEvent<HTMLInputElement> | 'selectAll',
    industryData: ReadonlyArray<any>
  ) => {
    // if checkboxes is checked
    //  or 'selectAll' provided instead
    if (
      (e !== 'selectAll' && e && e.target && e.target.checked) ||
      e === 'selectAll'
    ) {
      // then expand all
      setExpandedRows(
        industryData
          ? (industryData.map(
            (n: any) => n && n.industry
          ) as React.SetStateAction<never[]>)
          : []
      )
      return
    }
    // else collapse all
    setExpandedRows([])
  }

  return (
    <Mutation mutation={updateIndustries}>
      {(updateIndustriesMutation) => (
        <Query
          query={industryDataQuery}
          variables={{ baseCoin: 'USD' }}
          onCompleted={(data) => {
            if (expandedRows.length === 0 && mountedRef.current === false) {
              // tslint:disable-next-line
              mountedRef.current = true
              const industryData = combineIndustryData({ data, red, green })

              updateIndustriesMutation({
                variables: { industries: industryData.chartData },
              })
              onSelectAllClick('selectAll', industryData.industryData)
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

            const industryData = combineIndustryData({ data, red, green })
              .industryData

            return (
              <Table
                id="PortfolioIndustryTable"
                actionsColSpan={3}
                expandableRows={true}
                onChange={expandRow}
                onSelectAllClick={(e: any) => onSelectAllClick(e, industryData)}
                expandedRows={expandedRows}
                title={'Industry Performance'}
                {...putDataInTable(industryData)}
              />
            )
          }}
        </Query>
      )}
    </Mutation>
  )
}

export default IndustryTable
