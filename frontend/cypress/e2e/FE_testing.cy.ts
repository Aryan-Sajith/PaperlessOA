describe('login', () => {
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
})

describe('profile', () => {
  it("should contain the correct profile data", () =>{
    cy.get(`[data-testid=profile-salary]`).should("have.text","Salary: $1000000")
    cy.get(`[data-testid=profile-manager]`).should("have.text","Manager: true")
    cy.get(`[data-testid=profile-start]`).should("have.text","Start Date: 12/31/1969")
    cy.get(`[data-testid=profile-DOB]`).should("have.text","Birth Date: 12/31/1969")
    cy.get(`[data-testid=profile-level]`).should("have.text","Level: E-4")
  })
})
describe('hiearchy',()=>{
  it("should show the correct employee when looked up on hierarchy", ()=>{
    cy.visit('http://localhost:3000/hierarchy')
    cy.get(`[id="react-select-3-input"]`).type("Jacob Cohen").type('{enter}')
    cy.get(`[data-testid=box-container]`).within(()=>{
      cy.get(`[data-testid=box-name]`).should("have.text","Jacob Cohen")
      cy.get(`[data-testid=box-position]`).should("have.text","CEO")
      cy.get(`[data-testid=box-salary]`).should("have.text","Salary: 1000000")
    }).click()
  })
  it("should show the subordinates correctly when clicked", ()=>{
    cy.get(`[data-testid=box-container]`).eq(1).within(()=>{
      cy.get(`[data-testid=box-name]`).should("have.text","Leo Ciccarelli")
      cy.get(`[data-testid=box-position]`).should("have.text","CFO")
      cy.get(`[data-testid=box-salary]`).should("have.text","Salary: 500000")
    })
  })
})

describe('Tasks and Analytics',()=>{
    it("creates deletes and updates tasks and this is reflected in analytics",()=>{

    cy.visit('http://localhost:3000/analytics')
    cy.wait(1000)
    /*cy.get(`[data-testid="analytics-toggle"]`).eq(1).click()
    cy.get(`[data-testid="analytics-select"]`).contains("Next Month").click()
    cy.wait(1000)*/
    cy.get(`[data-testid="analytics-pending"]`).then(($elem)=>{
      //store analytics value for pending tasks
      const pending = parseInt($elem.text())

      // should properly create a task
        cy.visit('http://localhost:3000/tasks')
        cy.get(`[data-testid=make-task]`).click()
        cy.get(`[id="react-select-3-input"]`).type("In Progress").type(`{enter}`)
        cy.get(`[placeholder="Enter task description"]`).type("Cypress test").type(`{enter}`)
        cy.get(`[id="react-select-5-input"]`).type("HR").type(`{enter}`)
        cy.get(`[data-testid="add-task"]`).click()
        cy.get(`[data-testid="task-container"]`).filter((_,el) =>{
            return Cypress.$(el).find(`[data-testid="task-name"]`).text() === "Cypress test"
        }).should('exist')

      //should be reflected in analytics
      cy.visit('http://localhost:3000/analytics')
      /*cy.get(`[data-testid="analytics-toggle"]`).eq(1).click()
      cy.get(`[data-testid="analytics-select"]`).contains("Next Month").click()*/
      cy.wait(1000)
      cy.get(`[data-testid="analytics-pending"]`).should("have.text",String(pending + 1))
      
      //should be properly edited 
      cy.visit('http://localhost:3000/tasks')
      cy.get(`[data-testid="task-container"]`).filter((_,el) =>{
        return Cypress.$(el).find(`[data-testid="task-name"]`).text() === "Cypress test"
    }).within(()=>{
      cy.get(`[data-testid="task-edit"]`).click()
      cy.get(`[placeholder="Enter task description"]`).clear().type("Edited Test")
      cy.get(`[data-testid=task-edit-btn]`).click()
    })

    cy.get(`[data-testid="task-container"]`).filter((_,el) =>{
      return Cypress.$(el).find(`[data-testid="task-name"]`).text() === "Cypress test"
    }).should('not.exist')

    //task can properly be deleted
    cy.get(`[data-testid="task-container"]`).filter((_,el) =>{
      return Cypress.$(el).find(`[data-testid="task-name"]`).text() === "Edited Test"
    }).should('exist').within(()=>{
      cy.get(`[data-testid=task-delete]`).click()
    })

    
    cy.get(`[data-testid="task-container"]`).filter((_,el) =>{
      return Cypress.$(el).find(`[data-testid="task-name"]`).text() === "Edited Test"
    }).should('not.exist')

    //deletion is reflected in anayltics
    cy.visit('http://localhost:3000/analytics')
    cy.wait(1000)
    cy.get(`[data-testid="analytics-pending"]`).should("have.text",String(pending))
  })
})

  
})