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

import { persist } from './persist'

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
        responseType: 'token id_token',
        redirectUri: "http://localhost:3000",
    });

    webAuth.login(
      {
        realm: 'Username-Password-Authentication',
        username: email,
        password: password,
      }
    ) 
      auth0.parseHash(function(err, authResult) {
      err && reject(err);
      console.log(authResult); // undefined!!!
      resolve(authResult);
    });
  })
})

Cypress.Commands.add('login', (email, password) => {
  Cypress.log({
    name: 'loginBySingleSignOn'
  });
  cy.visit('/')
  cy.setLoginToStorage(email, password).then(() => {
    cy.reload(true)
  })
})

Cypress.Commands.add('notShowTipsStorageAndLogin', () => {
  return new Cypress.Promise((resolve, reject) => {
    window.localStorage.setItem('apollo-cache-persist',
      JSON.stringify(persist)
    )
    resolve()
  })
})

Cypress.Commands.add('notShowTips', () => {
  cy.visit('/')
  cy.notShowTipsStorage()
  cy.reload()
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
