import React from 'react';
import Reboot from 'material-ui/Reboot';
import { compose } from 'recompose'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Home from '../Home'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

if (process.browser) {
  window.theme = theme;
}

const App = () => {
  return (
    <main>
    <MuiThemeProvider theme={theme}>
      <Reboot />
      <Home />
      </MuiThemeProvider>
    </main>
  );
};

export default compose(
)(App)

