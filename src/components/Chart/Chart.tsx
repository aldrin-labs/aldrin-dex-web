import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const SingleChart = () => (
  <Wrapper>
    <iframe src={'http://chart.cryptocurrencies.ai/'} height={'100%'} />
  </Wrapper>
)
