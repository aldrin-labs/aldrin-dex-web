import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ResponsiveContainer, PieChart, Pie, Legend } from 'recharts'
// import query from './TestComp.graphql'

import HomePage from 'components/pages/HomePage'

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
]

const Container = styled.div`
  width: 800px;
  height: 800px;
`

const SimplePieChart = () => (
  <ResponsiveContainer>
    <PieChart>
      <Pie data={data} fill="#8884d8" label />
    </PieChart>
  </ResponsiveContainer>
)

const Chart = () => (
  <div>
    <HomePage>
      <Container>
        <SimplePieChart />
      </Container>
    </HomePage>
  </div>
)

export default Chart
