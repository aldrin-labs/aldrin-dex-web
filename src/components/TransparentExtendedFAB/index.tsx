import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import { Button } from '@material-ui/core'

const ButtonStyled = withStyles((theme) => ({
  root: {
    height: 38,
    background: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    boxShadow: 'none',
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}))(Button)

export default (props) => (
  <ButtonStyled size="small" onClick={props.onClick} variant="extendedFab">
    {props.children}
  </ButtonStyled>
)
