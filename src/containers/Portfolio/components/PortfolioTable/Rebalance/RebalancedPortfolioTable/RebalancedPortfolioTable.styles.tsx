import React from 'react'
import styled from 'styled-components'

import { Card } from '@material-ui/core'

export const LoaderWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props: { background: string }) => props.background};

  z-index: 1000;

  & > div {
    z-index: 1;
  }
`

export const LoaderInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const ContentInner = styled(Card)`
  height: 100%;
  display: flex;
`

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const TitleItem = styled.div``
