describe('Should switch tabs', () => {
  before(function() {
    cy.visit('/portfolio')
    cy.notShowTips()
  })

  context('Portfolio', () => {
    it('Main should be shown by default', () => {
      const mainTabButton = cy.get('#main_tab_button')
      mainTabButton.should('exist')
      cy.get('#main_tab').should('be.visible')
    })

    it('Industry tab button click should switch to industry button', () => {
      cy.get('#industry_tab_button').should('exist')

      cy.get('#industry_tab').should('have.attr', 'hidden')

      cy.get('#industry_tab_button').click()

      cy.get('#industry_tab').should('be.visible')
    })

    it('Main tab button click should return to main and hide industry', () => {
      cy.get('#main_tab_button').should('exist')

      cy.get('#main_tab').should('not.be.visible')

      cy.get('#main_tab_button').click()

      cy.get('#main_tab').should('be.visible')
    })

    it('Rebalance tab button click should switch to rebalance', () => {
      cy.get('#rebalance_tab_button').should('exist')

      cy.get('#rebalance_tab').should('not.be.visible')

      cy.get('#rebalance_tab_button').click()

      cy.get('#rebalance_tab').should('be.visible')
    })

    it('correlation tab button click should switch to correlation', () => {
      cy.get('#correlation_tab_button').should('exist')

      cy.get('#correlation_tab').should('not.be.visible')

      cy.get('#correlation_tab_button').click()

      cy.get('#correlation_tab').should('be.visible')
    })

    it('optimization tab button click should switch to optimization', () => {
      cy.get('#optimization_tab_button').should('exist')

      cy.get('#optimization_tab').should('not.be.visible')

      cy.get('#optimization_tab_button').click()

      cy.get('#optimization_tab').should('be.visible')
    })
  })
})
