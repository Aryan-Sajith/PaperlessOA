describe('testing', () => {
  it('visits the webpage (if this fails webpage is most likely not up)', () => {
    cy.visit('http://localhost:3000')
  })
})