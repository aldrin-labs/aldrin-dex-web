context('Actions', () => {
  before(function() {
    cy.clearLocalStorage()
  })
/*  for (var i = 0; i < 9; i++) {
    it('autologinTest', () => {
      cy.login('NGE@NGE.nge', 'nge')
      cy.get('.UserLink').should('exist')
    })
  }*/
  it('autologinTest', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.get('.UserLink').should('exist')
  })
})
