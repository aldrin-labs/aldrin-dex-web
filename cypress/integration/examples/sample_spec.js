context('Actions', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('Tips test', () => {
    cy.notShowTips()
    cy.wait(1000)
  })
})
