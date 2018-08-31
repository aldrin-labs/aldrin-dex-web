import { Typography } from '@material-ui/core'
import styled from 'styled-components'

export const TypographyWithCustomColor = styled(Typography)`
  color: ${(props: { textColor?: string }) => props.textColor};
`
