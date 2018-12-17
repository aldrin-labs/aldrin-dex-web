import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export const TypographyWithCustomColor = styled(({textColor, ...rest}) => <Typography {...rest} />)`
  color: ${(props: { textColor?: string }) => props.textColor};
`
