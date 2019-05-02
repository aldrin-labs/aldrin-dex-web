describe('Keys', () => {
  before(function() {
    cy.clearLocalStorage()
  })

  beforeEach(function () {
    cy.visit('/user')
    cy.notShowTips()
    cy.waitLoading()
  })

  it('Add key', () => {
    cy.waitLoading()
    cy.get('#name').type('test')
    cy.get('#apiKey').type('f70hLY75SVVBuRUhvsLrN09SlrEXPm2tSU6a59F0pGw8lX5K2Y24cAHxZ2S017Nw')
    cy.get('#secretOfApiKey').type('a1ohBhE2SVtDHnijzAsPyUIAQGBEjPjTBSg9zewTKeIzsQRYpoNPr44xocDM3r5n')
    cy.get('#ExchangeSelect').find('input').type(`Binance{enter}`)
    cy.get('#AddKeyButton').click()
    cy.wait(3000)
    cy.get('#KeysTable > tbody > tr').contains('test')
  })

  it('Key on portfolio', () => {
    cy.notShowTips()
    cy.visit('/portfolio')
    cy.waitLoading()
    cy.get('.settingsIcon').click()
    cy.get('#AccountsList').contains('test')
  })

  it('Change account', () => {
    cy.get('#KeysTable > tbody > tr').contains('test').should('exist')
    cy.notShowTipsSecondAcc()
    cy.visit('/user')
    cy.waitLoading()
    cy.get('#KeysTable > tbody > tr').contains('test').should('not.exist')
  })

  it('Delete key', () => {
  cy.wait(2000)
    cy.get('#KeysTable').first().find('tr').contains('test').siblings().last().click()
    cy.get('#keyNameInput').type('test')
    cy.get('#DeleteDialogButton').click()
    cy.wait(2000)
    cy.get('#KeysTable > tbody > tr').contains('test').should('not.exist')
  })
})
