describe('Login', () => {
  before(function() {
    cy.clearLocalStorage()
  })
  it('Login', () => {
    cy.visit('/')
    cy.get('.loginButton').click()
    cy.get(
      '.auth0-lock-input-email > .auth0-lock-input-wrap > .auth0-lock-input'
    ).type('NGE@NGE.nge')
    cy.get(
      '.auth0-lock-input-show-password > .auth0-lock-input-block > .auth0-lock-input-wrap > .auth0-lock-input'
    ).type('nge')
    cy.get('.auth0-lock-submit').click()
/*    if (cy.get('[aria-label="Skip"]')) {
      cy.get('[aria-label="Skip"]').click()
    }*/

    cy.get('.UserLink').should('exist')
  }),
  it('Login', () => {
    window.localStorage.setItem(
      'persist:login',
      '{"user":"{\"sub\":\"auth0|5bfd48f0301a9f3aa493b8bf\",\"nickname\":\"nge\",\"name\":\"nge@nge.nge\",\"picture\":\"https://s.gravatar.com/avatar/db05d07d32eb64d32742517f4326f21d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fng.png\",\"updated_at\":\"2018-12-02T14:41:19.213Z\",\"email\":\"nge@nge.nge\",\"email_verified\":false}","loginStatus":"true","_persist":"{\"version\":-1,\"rehydrated\":true}"}'
      )
    cy.visit('/')
    cy.get('.UserLink').should('exist')
  })
})
