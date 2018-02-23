import React, { SFC } from 'react'
import styled from 'styled-components'

const ChartContainer = styled.div`
  height: 93vh;
  width: 100%;
`

export const Chart = () => (
    <ChartContainer>
        <iframe src={'http://chart.igorlimansky.me'} height={'100%'} width={'100%'}/>
    </ChartContainer>
)
