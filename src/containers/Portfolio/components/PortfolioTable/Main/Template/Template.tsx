import React, { ReactElement } from 'react'
import {
  GridContainer,
  TablesWrapper,
  TableWrapper,
  ChartContainer,
} from '../PortfolioTableBalances.styles'
import { Grid } from '@material-ui/core'

const Template = ({
  Chart,
  PortfolioActions,
  PortfolioMainTable,
}: {
  Chart: ReactElement<any>
  PortfolioActions: ReactElement<any>
  PortfolioMainTable: ReactElement<any>
}) => {
  return (
    <GridContainer container={true} spacing={16}>
      <TablesWrapper spacing={16} container={true} item={true} xs={12}>
        <Grid item={true} xs={12} md={8}>
          <TableWrapper className="PortfolioMainTable">
            {/* refactor to pass this via Apollo  */}
            {PortfolioMainTable}
          </TableWrapper>
        </Grid>
        <Grid item={true} xs={12} md={4}>
          <TableWrapper className="PortfolioTradeOrderHistoryTable">
            {PortfolioActions}
          </TableWrapper>
        </Grid>
      </TablesWrapper>

      <ChartContainer item={true} xs={12} md={12}>
        {Chart}
      </ChartContainer>
    </GridContainer>
  )
}

export default Template
