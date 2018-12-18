// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('waitLoading', () => {
  cy.get('[data-e2e="Loadig"]', { timeout: 10000 }).should("exist");
  cy.get('[data-e2e="Loadig"]', { timeout: 10000 }).should("not.exist");
})

const auth0 = require('auth0-js');

Cypress.Commands.add('setLoginToStorage', (email, password) => {
  return new Cypress.Promise((resolve, reject) => {
    const webAuth = new auth0.WebAuth({
        domain: 'ccai.auth0.com', // Get this from https://manage.auth0.com/#/applications and your application
        clientID: '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm', // Get this from https://manage.auth0.com/#/applications and your application
        responseType: 'token id_token'
    });

    webAuth.client.login(
      {
        realm: 'Username-Password-Authentication',
        username: email,
        password: password,
        audience: 'localhost:5080', // Get this from https://manage.auth0.com/#/apis and your api, use the identifier property
        scope: 'openid'
      },
      function(err, authResult) {
        // Auth tokens in the result or an error
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.localStorage.setItem('token', authResult.idToken);
          webAuth.client.userInfo(authResult.accessToken, (error, profile) => {
            if (error) {
              console.error('Problem getting user info', error)
              reject(err)
            }
            window.localStorage.setItem('persist:login',
              JSON.stringify({
                loginStatus: JSON.stringify(true),
                user: JSON.stringify(profile),
                _persist: JSON.stringify({
                  version:-1,
                  rehydrated :true
                })
              })
            )
            resolve()
          })

        } else {
          console.error('Problem logging into Auth0', err);
          reject(err)
          throw err
        }
      }
    )
  })
})

Cypress.Commands.add('login', (email, password) => {
  Cypress.log({
    name: 'loginBySingleSignOn'
  });
  window.localStorage.setItem('persist:root', '')
  cy.visit('/')
  cy.setLoginToStorage(email, password).then(() => {
    cy.reload(true)
  })
})

Cypress.Commands.add('notShowTipsStorage', () => {
  return new Cypress.Promise((resolve, reject) => {
    window.localStorage.setItem('persist:root',
      JSON.stringify({
        user: JSON.stringify({
          toolTip: {
            portfolioMain: false,
            portfolioIndustry: false,
            portfolioRebalance: false,
            portfolioCorrelation: false,
            portfolioOptimization: false,
            chartPage: false,
            multiChartPage: false,
          }
        }),
        _persist: JSON.stringify({
          version:-1,
          rehydrated :true
        })
      })
    )
    resolve()
  })
})

const notShowTipsFuncton = () => {
  cy.visit('/')
  cy.notShowTipsStorage().then(() => {
    cy.reload()
    cy.wait(1000)
    cy.get('body').then(($body) => {
      if ($body.find('.joyride-overlay').length) {
        notShowTipsFuncton()
      }
    })
  })
}

Cypress.Commands.add('notShowTips', () => {
  notShowTipsFuncton()
})



Cypress.Commands.add(
  'chooseReactSelectOption',
  (selector, text, option) => {
    cy.get(`${selector} input`)
      .first()
      .click({ force: true })
      .type(text, { force: true })
      .get(`${selector} .select__menu`)
      .contains(option)
      .click()
  }
)
