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

    it('Should switch BTC/USDT', () => {
      cy.skipTip()
      cy.get('[data-e2e="toggleCurrency"]').should('exist')
      cy.get('[data-e2e="toggleCurrency"]').contains('BTC')
      cy.get('[data-e2e="toggleCurrency"]').click()
      cy.get('[data-e2e="toggleCurrency"]').contains('USD')
    })
  })
})
