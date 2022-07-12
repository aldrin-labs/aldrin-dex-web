import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  .fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .fa-circle:before {
    content: '\f111';
  }

  .fa-usd:before {
    content: '\f155';
  }

  .fa-btc:before {
    content: '\f15a';
  }

  .fa-arrow-left:before {
    content: '\f060';
  }

  .fa-arrow-right:before {
    content: '\f061';
  }

  .fa-ellipsis-h:before {
    content: '\f141';
  }
`
