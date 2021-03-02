//import { describe } from "mocha";

//cypress는 react와 달리 test를 위해 mocha사용
//@testing-library/cypress를 이용해서 ReactComponent를 가져오고 테스트 가능

describe("Log In", () => {
  it("should see login page", () => {
    //cy : cypress
    //cy.visit("http://localhost:3000/") //cypress.json파일에 baseUrl값을 설정하면 매번 localhost:3000을 적지 않아도 됨
    cy.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("can fill out the form", () => {
    cy.visit("/")
      //.get('[placeholder="Email"]')
      .findByPlaceholderText(/email/i) //@testing-library/cypress가 있기 때문에 get('....')대신 findByPlacehoderText등을 사용가능
      .type("1234@test.com")
      .findByPlaceholderText(/password/i)
      .type("1234123412")
      //.get(".text-lg")
      .findByRole("button")
      .should("not.have.class", "pointer-events-none");

    //to do (can log in)
  });

  it("can see email / password validation errors", () => {
    cy.visit("/")
      .findByPlaceholderText(/email/i)
      .type("adfasdf")
      .findByRole("alert")
      .should("have.text", "Please enter a valid email");
  });
});
