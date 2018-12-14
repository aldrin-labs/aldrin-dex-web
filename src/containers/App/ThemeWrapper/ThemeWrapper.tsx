import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { Props } from './ThemeWrapper.types'
import { fade } from '@material-ui/core/styles/colorManipulator'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    customPalette: {
      red: { main: string }
      green: { main: string }
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    customPalette: {
      red: { main: string }
      green: { main: string }
    }
  }
}

function createMyTheme(options: ThemeOptions) {
  return createMuiTheme({
    customPalette: {
      red: { main: 'red' },
      green: { main: 'green' },
    },
    ...options,
  })
}

export default class ThemeWrapper extends Component<Props> {
  render() {
    const { themeMode } = this.props

    // refactor this
    const theme = createMyTheme(
      themeMode === 'dark'
        ? {
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
            customPalette: {
              red: {
                main: '#FE425A',
              },
              green: {
                main: '#48DCC6',
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
          }
        : // light theme
          {
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
                  border: `1px solid #DDE0E7`, // Some CSS
                },
              },
              MuiButton: {
                // Name of the component ⚛️ / style sheet
                textPrimary: {
                  // Name of the rule
                  color: '#4F4F5D', // Some CSS
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
                  color: '#41495E',
                },
                colorPrimary: {
                  color: '#BCC2CF',
                },
              },
            },
            customPalette: {
              red: {
                main: '#FE425A',
              },
              green: {
                main: '#3ED1BB',
              },
            },
            palette: {
              divider: fade('#BCC2CF', 0.5),
              type: themeMode,
              text: { primary: fade('#41495E', 0.69) },
              red: {
                main: '#FE425A',
              },
              green: {
                main: '#3ED1BB',
              },
              primary: {
                main: '#FEFEFE',
                dark: '#F3F3F3',
                light: '#FFF',
              },
              secondary: {
                main: '#48DCC6',
              },
              action: {
                selected: 'rgba(255, 255, 255, 0.05)',
              },
              background: {
                default: '#F5F5F6',
                paper: '#FEFEFE',
              },
            },
          }
    )
    if (window) window.theme = theme

    return (
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>
      </MuiThemeProvider>
    )
  }
}
