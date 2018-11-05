import React from 'react'
import { withStyles, CardHeader, createStyles, Theme } from '@material-ui/core'
import { CardHeaderProps } from '@material-ui/core/CardHeader'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: '1px 14px 1px 6px',
      width: '100%',
      height: theme.spacing.unit * 4,
      backgroundColor:
        theme.palette.type === 'dark'
          ? theme.palette.grey[900]
          : theme.palette.primary.dark,
    },
    action: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

const Header = (props: CardHeaderProps) => (
  <CardHeader
    titleTypographyProps={{ variant: 'button', color: 'secondary' }}
    classes={{
      root: props && props.classes && props.classes.root,
      action: props && props.classes && props.classes.action,
    }}
    {...props}
  />
)

export default withStyles(styles, { withTheme: true })(Header)
