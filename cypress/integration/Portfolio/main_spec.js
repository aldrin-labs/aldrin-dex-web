describe('portfolio main', () => {
  before(function() {
    cy.visit('/portfolio')
    cy.notShowTips()
    cy.waitLoading()
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

    it('Portfolio Chart Buttons are clickable', () => {
      cy.get('[data-e2e="1Y"]').click()
      cy.get('[data-e2e="7D"]').click()
      cy.get('[data-e2e="3M"]').click()
      cy.get('[data-e2e="1M"]').click()
      cy.get('[data-e2e="1D"]').click()
    })

    it('Should switch BTC/USDT', () => {
      cy.get('[data-e2e="toggleCurrency"]').should('exist')
      cy.get('[data-e2e="toggleCurrency"]').contains('BTC')
      cy.get('[data-e2e="toggleCurrency"]').click()
      cy.get('[data-e2e="toggleCurrency"]').contains('USD')
    })
  })
})
