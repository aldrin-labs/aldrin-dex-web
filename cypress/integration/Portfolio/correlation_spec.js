describe('portfolio correlation tests', () => {
  before(function() {
    cy.visit('/')

    cy.get('button > svg').click()
    cy.get('#correlation_tab_button').click()
    cy.wait(1500)
    cy.get('button > svg').click()
  })

  it('Render Portfolio Correlation Grid', () => {
    cy.get('#CorrelationGrid').should('exist')
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
