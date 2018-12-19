describe('User', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('Redirect if not logged', () => {
    cy.visit('/user')
    cy.url().should('include', '/portfolio')
  })
  it('UserPage', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.notShowTips()
    cy.get('.UserLink').click()
    cy.url().should('include', '/user')
  })
  it('UserPage warning', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.visit('/user')
    cy.contains('We currently support only Binance exchange and will be adding more exchanges soon!')
    cy.get('#UserPageWarning').find('button').click()
    cy.visit('/user')
    cy.get('#UserPageWarning').should('not.exist')
  })
})
