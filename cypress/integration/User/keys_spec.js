describe('Keys', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('Add key', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.visit('/user')
    cy.get('#UserPageWarning').find('button').click()
    cy.get('#name').type('test')
    cy.get('#apiKey').type('f70hLY75SVVBuRUhvsLrN09SlrEXPm2tSU6a59F0pGw8lX5K2Y24cAHxZ2S017Nw')
    cy.get('#secretOfApiKey').type('a1ohBhE2SVtDHnijzAsPyUIAQGBEjPjTBSg9zewTKeIzsQRYpoNPr44xocDM3r5n')
    cy.get('#ExchangeSelect').find('input').type(`Binance{enter}`)
    cy.get('#AddKeyButton').click()
    cy.wait(2000)
    cy.get('#KeysTable > tbody > tr').contains('test')
  })
  it('Key on portfolio', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.visit('/portfolio')
    cy.wait(2000)
    cy.skipTip()
    cy.get('.settingsIcon').click()
    cy.get('#AccountsList').contains('test')
  })
  it('Delete key', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.visit('/user')
    cy.wait(2000)
    cy.get('#UserPageWarning').find('button').click()
    cy.get('#KeysTable').first().find('tr').contains('test').siblings().last().click()
    cy.get('#keyNameInput').type('test')
    cy.get('#DeleteDialogButton').click()
    cy.wait(2000)
    cy.get('#KeysTable > tbody > tr').contains('test').should('not.exist')
  })
  it('Change account', () => {
    cy.login('NGE@NGE.nge', 'nge')
    cy.visit('/user')
    cy.get('#KeysTable > tbody > tr').contains('test').should('not.exist')
    cy.login('NGE2@NGE2.nge', 'nge')
    cy.visit('/user')
    cy.get('#KeysTable > tbody > tr').contains('test').should('exist')
  })
})
