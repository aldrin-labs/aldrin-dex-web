import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 59px - 80px);
`

export const SingleChart = () => (
  <Wrapper>
    <iframe src={'http://chart.igorlimansky.me'} height={'100%'} />
  </Wrapper>
)
