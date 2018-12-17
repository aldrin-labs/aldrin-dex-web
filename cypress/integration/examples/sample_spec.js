context('Actions', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('Tips test', () => {
    cy.visit('/')
    cy.notShowTips()
    cy.wait(1000)
  })
})
