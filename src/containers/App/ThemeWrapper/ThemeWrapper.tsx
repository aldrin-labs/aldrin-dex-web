import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { blueGrey, cyan, green, red } from '@material-ui/core/colors'

import { Props } from './ThemeWrapper.types'
import { fade } from '@material-ui/core/styles/colorManipulator'

export default class ThemeWrapper extends Component<Props> {
  render() {
    const { themeMode } = this.props

    const divider = '#707070'
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      overrides: {
        MuiCard: {
          // Name of the component ⚛️ / style sheet
          root: {
            // Name of the rule
            border: `1px solid ${fade(divider, 0.26)}`, // Some CSS
          },
        },
      },
      palette: {
        divider,
        type: themeMode,
        text: { primary: '#DBD9E6' },
        red: {
          main: '#48DCC6',
        },
        green: {
          main: '#FE425A',
        },
        primary: {
          main: '#303037',
          dark: '#1F1F24',
          light: '#27272D',
        },
        secondary: {
          main: '#48DCC6',
        },
        action: {
          selected: 'rgba(255, 255, 255, 0.05)',
        },
        background: {
          default: themeMode === 'light' ? '#fafafa' : '#16161D',
          paper: themeMode === 'light' ? '#fff' : '#16161D',
        },
      },
    })
    if (window) window.theme = theme

    return (
      <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
    )
  }
}
