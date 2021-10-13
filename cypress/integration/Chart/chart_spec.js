describe('Chart tests', () => {
  // before(() => {
  //   Cypress.Commands.add('chooseReactSelectOption', (selector, text, option) => {
  //     cy.get(`${selector} input`)
  //       .first()
  //       .click({ force: true })
  //       .type(text, { force: true })
  //       .get(`${selector} .custom-select-box__menu`)
  //       .contains(option)
  //       .click()
  //   })
  // })

  beforeEach(() => {
    cy.visit('/chart')
    cy.notShowTips()
    cy.waitLoading()
  })

  it('Should open RIN trade', () => {
    cy.url().should('include', 'RIN_USDC')
  })
})
