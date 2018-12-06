context('Actions', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('autologinTest', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.get('.UserLink').should('exist')
  })
})
