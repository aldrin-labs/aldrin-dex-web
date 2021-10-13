Cypress.Commands.add('waitLoading', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[data-e2e="Loadig"]', { timeout: 10000 }).length) {
      cy.get('[data-e2e="Loadig"]', { timeout: 10000 }).should('not.exist')
    }

    // else assume it was textarea
  })
  //  cy.get('[data-e2e="Loadig"]', { timeout: 10000 }).should("exist");
  //  cy.get('[data-e2e="Loadig"]', { timeout: 10000 }).should("not.exist");
})

Cypress.Commands.add('setE2EMark', () => {
  return new Cypress.Promise((resolve) => {
    window.localStorage.setItem('ALDRIN_E2E_MODE', 'true')
    resolve()
  })
})

Cypress.Commands.add('notShowTips', () => {
  Cypress.log({
    name: 'notShowTips',
  })
  cy.notShowTipsAndLoginStorage(0)
  cy.reload()
})

Cypress.Commands.add('notShowTipsSecondAcc', () => {
  Cypress.log({
    name: 'notShowTips',
  })
  cy.notShowTipsAndLoginStorage(1)
  cy.reload()
})

Cypress.Commands.add('chooseReactSelectOption', (selector, text, option) => {
  cy.get(`${selector} input`)
    .first()
    .click({ force: true })
    .type(text, { force: true })
    .get(`${selector} .select__menu`)
    .contains(option)
    .click()
})
