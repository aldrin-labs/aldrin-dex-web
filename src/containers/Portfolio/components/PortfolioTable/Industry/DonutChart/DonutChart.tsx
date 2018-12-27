import React from 'react'
import { DonutChart as Chart } from '@storybook-components/index'
import { Query } from 'react-apollo'

import { GET_INDUSTRIES } from '@core/queries/portfolio/GET_INDUSTRIES'
import { withTheme, WithTheme } from '@material-ui/styles'
import { Theme, ConsistentWith } from '@material-ui/core'

const DonutChart: React.FunctionComponent<
  ConsistentWith<{ theme: Theme }, WithTheme<{}>>
> = ({ theme }) => {
  return (
    <Query query={GET_INDUSTRIES}>
      {({ data: { portfolioIndustries } }) => {
        return (
          <Chart
            theme={theme as Theme}
            labelPlaceholder="Industry %"
            data={portfolioIndustries.industries}
            colorLegend={true}
          />
        )
      }}
    </Query>
  )
}

export default withTheme()(DonutChart)
