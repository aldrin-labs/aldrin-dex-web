import React from 'react'
import styled from 'styled-components'
import { CHARTS_API_URL } from '@utils/config'
import { Card } from '@material-ui/core'

const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const SingleChart = ({ additionalUrl }: { additionalUrl: string }) => (
  <Wrapper>
    <iframe
      style={{ borderWidth: 0 }}
      src={`https://${CHARTS_API_URL}${additionalUrl}`}
      height={'100%'}
    />
  </Wrapper>
)
