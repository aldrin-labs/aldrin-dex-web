describe('optimisation', () => {
  before(function() {
    Cypress.Commands.add(
      'chooseReactCustomSelectOption',
      (selector, text, option) => {
        cy.get(`${selector} input`)
          .first()
          .click({ force: true })
          .type(text, { force: true })
          .get(`${selector} .custom-select-box__menu`)
          .contains(option)
          .click()
      }
    )
  })

  beforeEach(function () {
    cy.visit('/portfolio/optimization')
    cy.notShowTips()
    cy.waitLoading()
  })

  it('Render initial state', () => {
    cy.get('#Back-test').should('exist')
    cy.get('#Back-test').should('be.visible')

    cy.get('#RiskProfile').should('exist')
    cy.get('#RiskProfile').should('be.visible')

    cy.get('#PortfolioDistribution').should('exist')
    cy.get('#PortfolioDistribution').should('be.visible')

    cy.get('#BackTestOptimization').should('exist')
    cy.get('#BackTestOptimization').should('be.visible')

    cy.get('.EfficientFrontierChart').should('exist')
    cy.get('.EfficientFrontierChart').should('be.visible')

    // initial charts
    cy.get('.rv-xy-plot > .rv-xy-plot__inner').should('exist')
    cy.get('.rv-xy-plot > .rv-xy-plot__inner').should('be.visible')
  })

  it('Can inite parameters for optimization first time', () => {
    cy.chooseReactCustomSelectOption('#RebalancePeriod', '14 days', '14 days')
    cy.get('#SwitchRiskButtons').should('not.be.visible')
    cy.get('#ResetPortfolio').should('be.disabled')

    // set parameters
    cy.get('#your_unique_start_date_id')
      .click({ force: true })
      .type('11-01-2018', { force: true })
    cy.get('#your_unique_end_date_id')
      .click({ force: true })
      .type('11-30-2018', { force: true })
    cy.get('#RiskFreeAssetsSwitch').click()
    cy.get('#ButtonMUI').should('not.be.disabled')
    cy.get('#ButtonMUI').click()
    cy.waitLoading()
    cy.get('#SwitchRiskButtons').should('be.visible')

    // reset portfolio
    cy.get('#ResetPortfolio').should('not.be.disabled')
    cy.get('#ResetPortfolio').click()
    cy.get('#SwitchRiskButtons').should('not.be.visible')
  })

  it('Can inite parameters for optimization', () => {
    cy.get('#AddCoinText')
      .click({ force: true })
      .type('NO_COIN')
    cy.get('#AddIcon').click({ force: true })
    cy.get('#ResetPortfolio').should('not.be.disabled')

    // set parameters
    cy.get('#RiskFreeAssetsSwitch').click()
    cy.get('#ButtonMUI').should('not.be.disabled')
    cy.get('#ButtonMUI').click()
    cy.waitLoading()

    cy.get('#dialogOptimization').contains(
      `The coins ['NO_COIN'] currently are not found in any of the exchanges we support.`
    )

    cy.get('#okButtonDialog').should('be.visible')
    cy.get('#okButtonDialog').click()

    cy.get('#SwitchRiskButtons').should('be.visible')

    // reset portfolio
    cy.get('#ResetPortfolio').should('not.be.disabled')
    cy.get('#ResetPortfolio').click()
    cy.get('#SwitchRiskButtons').should('not.be.visible')
  })
})
