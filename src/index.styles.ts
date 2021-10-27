import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    /* latin */
    @font-face {
      font-family: 'DM Sans';
      font-style: normal;
      font-weight: 400;
      font-display: block;
      src: local('DM Sans Regular'), local('DMSans-Regular'),
        url('/fonts/DMSans.woff2') format('woff2');
    }

   
    @font-face {
      font-family: 'Avenir Next';
      font-style: normal;
      font-weight: 100;
      font-display: block;
      src: local('Avenir Next Thin'), local('AvenirNextCyr-Thin'),
        url('/fonts/AvenirNextCyr-Thin.woff2') format('woff2');
    }

    @font-face {
      font-family: 'Avenir Next';
      font-style: normal;
      font-weight: 200;
      font-display: block;
      src: local('Avenir Next Light'), local('AvenirNextCyr-Light'),
        url('/fonts/AvenirNextCyr-Light.woff2') format('woff2');
    }

    @font-face {
      font-family: 'Avenir Next';
      font-style: normal;
      font-weight: 400;
      font-display: block;
      src: local('Avenir Next'), local('AvenirNextCyr-Regular'),
        url('/fonts/AvenirNextCyr-Regular.woff2') format('woff2');
    }

    @font-face {
      font-family: 'Avenir Next';
      font-style: normal;
      font-weight: 500;
      font-display: block;
      src: local('Avenir Next Medium'), local('AvenirNextCyr-Medium'),
        url('/fonts/AvenirNextCyr-Medium.woff2') format('woff2');
    }
 

    @font-face {
      font-family: 'Avenir Next';
      font-style: normal;
      font-weight: 600;
      font-display: block;
      src: local('Avenir Next Demi'), local('AvenirNextCyr-Demi'),
        url('/fonts/AvenirNextCyr-Demi.woff2') format('woff2');
    }

    @font-face {
      font-family: 'Avenir Next';
      font-style: normal;
      font-weight: 700;
      font-display: block;
      src: local('Avenir Next Bold'), local('AvenirNextCyr-Bold'),
        url('/fonts/AvenirNextCyr-Bold.woff2') format('woff2');
    }

    /* Old code style */

    @font-face {
      font-family: 'Avenir Next Medium';
      font-style: normal;
      font-weight: 500;
      font-display: block;
      src: local('Avenir Next Medium'), local('AvenirNextCyr-Medium'),
        url('/fonts/AvenirNextCyr-Medium.woff2') format('woff2');
    }

    @font-face {
      font-family: 'Avenir Next Light';
      font-style: normal;
      font-weight: 500;
      font-display: block;
      src: local('Avenir Next Light'), local('AvenirNextCyr-Light'),
        url('/fonts/AvenirNextCyr-Light.woff2') format('woff2');
    }

    @font-face {
      font-family: 'Avenir Next Demi';
      font-style: normal;
      font-weight: 600;
      font-display: block;
      src: local('Avenir Next Demi'), local('AvenirNextCyr-Demi'),
        url('/fonts/AvenirNextCyr-Demi.woff2') format('woff2');
    }

    @font-face {
      font-family: 'Avenir Next Thin';
      font-style: normal;
      font-weight: 300;
      font-display: block;
      src: local('Avenir Next Thin'), local('AvenirNextCyr-Thin'),
        url('/fonts/AvenirNextCyr-Thin.woff2') format('woff2');
    }

    @font-face {
      font-family: 'Avenir Next Bold';
      font-style: normal;
      font-weight: 700;
      font-display: block;
      src: local('Avenir Next Bold'), local('AvenirNextCyr-Bold'),
        url('/fonts/AvenirNextCyr-Bold.woff2') format('woff2');
    }


    /* Icons */

    @font-face {
      font-family: 'FontAwesome';
      src: url('/fonts/fontawesome-webfont.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: block;
    }

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