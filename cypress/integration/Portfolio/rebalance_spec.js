describe('Rebalance', () => {

  before(function() {
    cy.notShowTipsStorageAndLogin()
    cy.notShowTips()
    cy.visit('/portfolio')
    cy.get('#rebalance_tab_button').click()
    cy.wait(1500)
    // for popup on rebalance
    cy.get("body")
      .then(($body) => {
      return !!$body.find("#resetRebalancedPortfolioButton").length
    })
      .then((isFound) => {
        if (isFound) {
          cy.get("#resetRebalancedPortfolioButton").click()
          cy.get('button > svg').click()
          cy.get("#resetRebalancedPortfolioButton").click()
        }
      })
  })

  describe('Rebalace in not-edit mode', () => {
    it('Render Portfolio Rebalance table', () => {
      cy.get('#PortfolioRebalanceTable').should('exist')
      cy.get('#PortfolioRebalanceTable').should('be.visible')
      cy.get('#PortfolioRebalanceTable').contains('Rebalanced Portfolio')
    })

    it('Render Portfolio Rebalance bar chart', () => {
      cy.get('.rv-xy-plot__inner').should('exist')
      cy.get('.rv-xy-plot__inner').should('be.visible')
    })

    it('Render edit button in table', () => {
      cy.get('#editButton').should('exist')
      cy.get('#editButton').should('be.visible')
    })
  })

  describe('Rebalance in edit-mode', () => {
    // Should add a preparation function
    it('Enter in edit mode', () => {
      cy.get('#editButton').click()
    })

    it('Render snapshot button in table when edit mode enabled', () => {
      cy.get('#snapshotButton').should('exist')
      cy.get('#snapshotButton').should('be.visible')
    })

    it('Render discard changes button in table when edit mode enabled', () => {
      cy.get('#discardChangesButton').should('exist')
      cy.get('#discardChangesButton').should('be.visible')
    })

    it('Render reset changes button in table when edit mode enabled', () => {
      cy.get('#resetButton').should('exist')
      cy.get('#resetButton').should('be.visible')
    })

    it('Render save button in table when edit mode enabled', () => {
      cy.get('#saveButton').should('exist')
      cy.get('#saveButton').should('be.visible')
    })

    it('Render add row button', () => {
      cy.get('#addAssetButton').should('exist')
    })

    it('Render delete button for each asset (table row)', () => {
      cy.get('#PortfolioRebalanceTable > tbody > tr').then(() => {
        cy.get('#PortfolioRebalanceTable > tbody > tr [data-e2e="deleteAssetButton"]').then((deleteAssetButtonCollection) => {
          cy.get('#PortfolioRebalanceTable > tbody > tr').should('have.length', deleteAssetButtonCollection.length)
        })
      })
    })

    it('Render percentages input for each asset (table row)', () => {
      cy.get('#PortfolioRebalanceTable > tbody > tr').then(() => {
        cy.get('#PortfolioRebalanceTable > tbody > tr [data-e2e="percentageInput"]').then((percentageInputCollection) => {
          cy.get('#PortfolioRebalanceTable > tbody > tr').should('have.length', percentageInputCollection.length)
        })
      })
    })
  })




})
