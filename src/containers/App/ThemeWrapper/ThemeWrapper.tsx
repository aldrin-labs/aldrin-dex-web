import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { blueGrey, cyan, green, red } from '@material-ui/core/colors'

import { Props } from './ThemeWrapper.types'

export default class ThemeWrapper extends Component<Props> {
  render() {
    const { themeMode } = this.props
    const theme = createMuiTheme({
      palette: {
        type: themeMode,
        red: {
          main: red[400],
          dark: red.A700,
        },
        green: {
          main: green['500'],
          dark: green.A700,
        },
        primary: blueGrey,
        secondary: {
          ...cyan,
          main: '#4ed8da',
        },
        action: {
          selected: 'rgba(255, 255, 255, 0.05)',
        },
        background: {
          default: themeMode === 'light' ? '#fafafa' : '#303030',
          paper: themeMode === 'light' ? '#fff' : '#393e44',
        },
      },
    })
    if (window) window.theme = theme

    return (
      <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
    )
  }
}
