describe('Login', () => {
  it('Login', () => {
    cy.visit('/')
    cy.get('.loginButton').click()
    cy.get(
      '.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input',
      { timeout: 6000 }
    ).type('NGE@NGE.nge')
    cy.get(
      '.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input'
    ).type('nge')
    cy.get('.auth0-lock-submit').click()
    cy.get('.UserLink').should('exist')
  })
  it('Logout', () => {
    cy.visit('/')
    cy.notShowTips()
    cy.get('#ExitButton').click()
    cy.get('.loginButton').should('exist')
  })
})
