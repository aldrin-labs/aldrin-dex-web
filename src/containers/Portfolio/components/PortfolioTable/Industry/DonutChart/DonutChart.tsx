import React from 'react'
import { DonutChart as Chart } from '@storybook-components/index'
import { Query } from 'react-apollo'

import { GET_INDUSTRIES } from '../../../../../../queries/portfolio/GET_INDUSTRIES'
import { withTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

const DonutChart = ({ theme }: { theme: Theme }) => {
  return (
    <Query query={GET_INDUSTRIES}>
      {({ data: { portfolioIndustries } }) => {
        return (
          <Chart
            theme={theme}
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
