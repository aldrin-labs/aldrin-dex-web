import React from 'react'
import { DonutChart as Chart } from '@storybook-components/index'
import { Query } from 'react-apollo'

import { GET_INDUSTRIES } from '../../../../../../queries/portfolio/GET_INDUSTRIES'

const DonutChart = () => {
  return (
    <Query query={GET_INDUSTRIES}>
      {({ data: { portfolioIndustries } }) => {
        return (
          <Chart
            labelPlaceholder="Industry %"
            data={portfolioIndustries.industries}
            colorLegend={true}
          />
        )
      }}
    </Query>
  )
}

export default DonutChart
