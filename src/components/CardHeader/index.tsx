import React from 'react'
import { withStyles, CardHeader, createStyles, Theme } from '@material-ui/core'
import { CardHeaderProps } from '@material-ui/core/CardHeader'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: '1px 14px 1px 6px',
      width: '100%',
      height: theme.spacing.unit * 4,
      backgroundColor: theme.palette.grey[900],
    },
  })

const Header = (props: CardHeaderProps) => (
  <CardHeader
    titleTypographyProps={{ variant: 'button', color: 'secondary' }}
    className={props && props.classes && props.classes.root}
    {...props}
  />
)

export default withStyles(styles, { withTheme: true })(Header)
