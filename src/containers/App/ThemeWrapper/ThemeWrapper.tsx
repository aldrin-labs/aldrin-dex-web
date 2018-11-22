import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import { Props } from './ThemeWrapper.types'
import { fade } from '@material-ui/core/styles/colorManipulator'

export default class ThemeWrapper extends Component<Props> {
  render() {
    const { themeMode } = this.props

    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
        body1: {
          fontSize: '0.875rem',
        },
        title: {
          fontSize: '0.875rem',
        },
        body2: {
          fontSize: '0.875rem',
        },
      },
      overrides: {
        MuiCard: {
          // Name of the component ⚛️ / style sheet
          root: {
            // Name of the rule
            border: `1px solid ${fade('#707070', 0.26)}`, // Some CSS
          },
        },
        MuiPaper: {
          // Name of the component ⚛️ / style sheet
          rounded: {
            // Name of the rule
            borderRadius: '6px', // Some CSS
          },
        },
        MuiIconButton: {
          root: {
            color: '#FFFFFF',
          },
          colorPrimary: {
            color: '#575A64',
          },
        },
      },
      palette: {
        divider: fade('#748AA1', 0.16),
        type: themeMode,
        text: { primary: '#DBD9E6' },
        red: {
          main: '#FE425A',
        },
        green: {
          main: '#48DCC6',
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
