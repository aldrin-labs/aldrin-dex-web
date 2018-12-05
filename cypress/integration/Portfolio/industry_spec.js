describe('portfolio industry', () => {
  before(function() {
    cy.visit('/')
    cy.clearLocalStorage()
    cy.get('button > svg').click()
    cy.get('#industry_tab_button').click()
    cy.wait(1500)
    cy.get('button > svg').click()
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
