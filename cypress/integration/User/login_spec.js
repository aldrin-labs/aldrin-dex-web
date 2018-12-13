describe('Login', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('Login', () => {
    cy.visit('/')
    cy.notShowTips()
    cy.get('.loginButton').click()
    cy.get(
      '.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input'
    ).type('NGE@NGE.nge')
    cy.get(
      '.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input'
    ).type('nge')
    cy.get('.auth0-lock-submit').click()
    cy.get('.UserLink').should('exist')
  })
  it('Logout', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.notShowTips()
    cy.get('#ExitButton').click()
    cy.get('.loginButton').should('exist')
  })
})
