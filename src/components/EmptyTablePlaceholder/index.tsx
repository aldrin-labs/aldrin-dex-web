import React from 'react'
import { Typography } from '@material-ui/core'

import { PTWrapper } from '@containers/Portfolio/components/PortfolioTable/Main/PortfolioTableBalances/PortfolioTableBalances.styles'

export default (props: { isEmpty: boolean; children: React.ReactChild }) => {
  if (props.isEmpty) {
    return (
      <PTWrapper tableData={true}>
        <Typography variant="display3" color="textPrimary" align="center">
          Add account for Portfolio.
        </Typography>
        <Typography variant="display1" color="textSecondary" align="center">
          Click on user icon at Navigation bar.
        </Typography>
      </PTWrapper>
    )
  }

  return <>{props.children}</>
}
