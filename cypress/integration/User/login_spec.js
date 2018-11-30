describe('Login', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('Login', () => {
    cy.visit('/')
    cy.get('.loginButton').click()
    cy.get(
      '.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input'
    ).type('NGE@NGE.nge')
    cy.get(
      '.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input'
    ).type('nge')
    cy.get('.auth0-lock-submit').click()
    if (cy.get('[aria-label="Skip"]')) {
      cy.get('[aria-label="Skip"]').click()
    }

    cy.get('.UserLink').should('exist')
  })
})
