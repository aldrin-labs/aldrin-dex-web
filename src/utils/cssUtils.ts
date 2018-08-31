import styled from 'styled-components'
import { Typography } from '@material-ui/core'
import { TypographyWithCustomColor } from '@styles/components'
import ReactSelectComponent from '@components/ReactSelectComponent'

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

export const TypographyFullWidth = styled(TypographyWithCustomColor)`
  width: 100%;
  flex-grow: 1;
`
export const SelectR = styled(ReactSelectComponent)`
  font-family: Roboto;
  font-size: 16px;
  border-bottom: 1px solid #c1c1c1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-bottom: 2px solid #fff;
  }
`
