describe('portfolio industry', () => {
  beforeEach(function () {
    cy.visit('/portfolio/industry')
    cy.notShowTips()
    cy.waitLoading()
  })

  it('Render Portfolio Industry table', () => {
    cy.get('#PortfolioIndustryTable').should('exist')
    cy.get('#PortfolioIndustryTable').should('be.visible')
    cy.get('#PortfolioIndustryTable').contains('Industry Performance')
  })

  it('Render Portfolio PieChart', () => {
    cy.get('.rv-xy-plot__inner').should('exist')
    cy.get('.rv-xy-plot__inner').should('be.visible')
  })
})
