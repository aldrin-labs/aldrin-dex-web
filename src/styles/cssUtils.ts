import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export const customAquaScrollBar = `
&::-webkit-scrollbar {
    width: 3px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(45, 49, 54, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #4ed8da;
  }`

export const TypographyFullWidth = styled(Typography)`
  width: 100%;
  flex-grow: 1;
`
