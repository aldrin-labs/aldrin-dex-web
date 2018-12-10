describe('chart tests', () => {
  before(function() {
    Cypress.Commands.add(
      'chooseReactSelectOption',
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

    cy.visit('/chart')

    cy.get('[style="line-height: 1.4; text-align: center;"] > button').click()
  })

  it('switch between depth/candle chart', () => {
    cy.get('[data-e2e="mainChart__typeOfChartSwitcher"]').click()
    cy.get('[data-e2e="mainDepthChart"]').should('exist')
  })

  it('expand/collapse tradeHistory table', () => {
    cy.get('[data-e2e="tradeHistory__body"]').should('be.visible')
    cy.get('[data-e2e="tradeHistory__arrowButton"]').click()
    cy.get('[data-e2e="tradeHistory__body"]').should('not.be.visible')
    cy.get('[data-e2e="tradeHistory__arrowButton"]').click()
    cy.get('[data-e2e="tradeHistory__body"]').should('be.visible')
  })

  it('When change coins chart url changes', () => {
    cy.get('[data-e2e="mainChart__typeOfChartSwitcher"]').click()
    cy.get('#currencyPair')
      .invoke('text')
      .then((text) => {
        const changedText = text.trim().replace('_', '/')
        cy.get('iframe').should(
          'have.attr',
          'src',
          `https://develop.chart.cryptocurrencies.ai/?symbol=${changedText}`
        )
      })

    cy.chooseReactSelectOption('#currencyPair', 'LTC_BTC', 'LTC_BTC')
    cy.get('iframe').should(
      'have.attr',
      'src',
      'https://develop.chart.cryptocurrencies.ai/?symbol=LTC/BTC'
    )
  })

  it('Switch between multi chart and single chart', () => {
    cy.get('[data-e2e="switchChartPageMode"]').click()
    cy.get('[style="line-height: 1.4; text-align: center;"] > div').contains(
      'Select more pairs with up-to 8 charts.'
    )
  })

  it('check add and delete charts on multichart page', () => {
    cy.get('button > svg').click()
    cy.chooseReactSelectOption('#currencyPair', 'BTC_USDT', 'BTC_USDT')
    cy.get(':nth-child(2) >  iframe').should('be.visible')
    cy.get(
      ' [data-e2e="chart-container"]  :nth-child(2) [data-e2e="chart-switcher"] .deleteChart'
    ).click()
    cy.get(
      ' [data-e2e="chart-container"]  :nth-child(2) [data-e2e="chart-switcher"] .deleteChart'
    ).should('not.exist')
  })
})
