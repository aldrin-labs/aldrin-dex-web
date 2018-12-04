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
  cy.get( "#Loadig").should("exist");
  cy.get( "#Loadig", { timeout: 10000 }).should("not.exist");
})

const auth0 = require('auth0-js');

Cypress.Commands.add('login', (email, password) => {
  Cypress.log({
      name: 'loginBySingleSignOn'
  });
  cy.clearLocalStorage()
  cy.visit('/')
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
        })
      } else {
        console.error('Problem logging into Auth0', err);
        throw err;
      }
    }
  )
  cy.waitLoading()
  cy.reload(true)
  cy.waitLoading()
});

Cypress.Commands.add('skipTip', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[aria-label="Skip"]').length) {
      cy.get('[aria-label="Skip"]').click()
    }
  })
})
