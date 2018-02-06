import { NavBar } from '@components/NavBar'
import React, { SFC } from 'react'
import styled from 'styled-components'

const ChartContainer = styled.div`
  height: 93vh;
  width: 100%;
`

export const Chart = () => (
  <ChartContainer>
    <NavBar />
    <iframe src={'http://localhost:3001'} height={'100%'} width={'100%'}/>
  </ChartContainer>
)
