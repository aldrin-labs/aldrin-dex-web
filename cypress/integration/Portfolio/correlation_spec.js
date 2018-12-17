describe('portfolio correlation tests', () => {
  before(function() {
    cy.visit('/portfolio')
    cy.notShowTips()
    cy.get('#correlation_tab_button').click()
    cy.waitLoading()
  })

  it('Render Portfolio Correlation Grid', () => {
    cy.get('#CorrelationGrid', { timeout: 10000 }).should('exist')
    cy.get('#CorrelationGrid').should('be.visible')
  })

  it('PopUp opening', () => {
    cy.get(`[aria-haspopup="true"]`).click()
    cy.get('[data-value="lastWeek"]').click()
  })
  it('Fullscreen button clicking', () => {
    cy.get(`#FullscreenButton`).click()
  })
})
