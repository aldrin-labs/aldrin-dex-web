describe('portfolio main', () => {
  before(function() {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  context('Portfolio', () => {
    it('Render Portfolio Main table', () => {
      cy.get('#PortfolioMainTable').should('exist')
      cy.get('#PortfolioMainTable').contains('Portfolio')
    })

    it('Render Portfolio Action table', () => {
      cy.get('#PortfolioActionsTable').should('exist')
    })

    it('Render Portfolio Chart', () => {
      cy.get('.mouse-target').should('exist')
    })
  })
})
