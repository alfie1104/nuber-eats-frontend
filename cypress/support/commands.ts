// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";

Cypress.Commands.add("assertLoggedIn", () => {
  cy.window().its("localStorage.token").should("be.a", "string");
});

Cypress.Commands.add("assertLoggedOut", () => {
  cy.window().its("localStorage.token").should("be.undefined");
});

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");

  // @ts-ignore
  cy.assertLoggedOut();

  //.get('[placeholder="Email"]')
  //get, type등 mocha의 함수들은 chainable이지만, @testing-library의 find instruction은 chainable이 아니므로 앞에 cy를 붙여줘야함.

  cy.title().should("eq", "Login | Nuber Eats");

  cy.findByPlaceholderText(/email/i).type(email); //@testing-library/cypress가 있기 때문에 get('....')대신 findByPlacehoderText등을 사용가능
  cy.findByPlaceholderText(/password/i).type(password);
  //.get(".text-lg")
  cy.findByRole("button")
    .should("not.have.class", "pointer-events-none")
    .click();

  // @ts-ignore
  cy.assertLoggedIn();
});
