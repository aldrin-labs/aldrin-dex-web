import React from 'react'
import styled from 'styled-components'
import { CHARTS_API_URL } from '../../utils/config'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const SingleChart = () => (
  <Wrapper>
    <iframe src={`http://${CHARTS_API_URL}`} height={'100%'} />
  </Wrapper>
)
