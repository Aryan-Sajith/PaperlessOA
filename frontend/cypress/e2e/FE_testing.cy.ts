describe('testing', () => {
  it('visits the webpage and properly loads login', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('eq','http://localhost:3000/login')
  })
  it("logs into a user sucessfully", ()=>{
    cy.get(`[data-testid=login-email]`).type("jacohen@gmail.com")
    cy.get(`[data-testid=login-password]`).type("password123")
    cy.get(`[data-testid=login-button]`).click()
    cy.url().should('eq','http://localhost:3000/profile')
  })
  it("should contain the correct profile data", () =>{
    cy.get(`[data-testid=profile-salary]`).should("have.text","Salary: $1000000")
    cy.get(`[data-testid=profile-manager]`).should("have.text","Manager: true")
    cy.get(`[data-testid=profile-start]`).should("have.text","Start Date: 12/31/1969")
    cy.get(`[data-testid=profile-DOB]`).should("have.text","Birth Date: 12/31/1969")
    cy.get(`[data-testid=profile-level]`).should("have.text","Level: E-4")
  })
})