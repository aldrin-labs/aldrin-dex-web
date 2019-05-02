describe('User', () => {
  beforeEach(function () {
    cy.visit('/user')
    cy.notShowTips()
    cy.waitLoading()
  })

  it('UserPage', () => {
    cy.get('.UserLink').click()
    cy.url().should('include', '/user')
  })
})
