describe('portfolio main chart', () => {
  before(function() {
    cy.clearLocalStorage()
  })

  context('Portfolio', () => {
    it('Logined', () => {
      cy.visit('/')
      cy.get(
        '.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input'
      ).type('NGE@NGE.nge')
      cy.get(
        '.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input'
      ).type('nge')
      cy.get('.auth0-lock-submit').click()
      if (cy.get('[aria-label="Skip"]')) {
        cy.get('[aria-label="Skip"]').click()
      }

      cy.get('.UserLink').should('exist')
    })

    it('Render Portfolio Main table', () => {
      cy.get(
        '.MuiGrid-grid-md-8-105 > .MuiPaper-elevation1-13 > .MuiPaper-root-10'
      ).should('exist')
      cy.contains('[colspan="8"] > .MuiTypography-root-177', 'Portfolio')
    })

    it('Render Portfolio Action table', () => {
      cy.get('.PortfolioActionTables').should('exist')
    })
  })
})
