describe('User', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('UserPage', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.skipTip()
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
