//import { describe } from "mocha";

//cypress는 react와 달리 test를 위해 mocha사용
//@testing-library/cypress를 이용해서 ReactComponent를 가져오고 테스트 가능

describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    //cy : cypress
    //cy.visit("http://localhost:3000/") //cypress.json파일에 baseUrl값을 설정하면 매번 localhost:3000을 적지 않아도 됨
    user.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("can see email / password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("adfasdf");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("1234@test.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByPlaceholderText(/password/i).click();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("can fill out the form and login", () => {
    user.visit("/");
    //.get('[placeholder="Email"]')
    //get, type등 mocha의 함수들은 chainable이지만, @testing-library의 find instruction은 chainable이 아니므로 앞에 cy를 붙여줘야함.
    user.findByPlaceholderText(/email/i).type("1234@test.com"); //@testing-library/cypress가 있기 때문에 get('....')대신 findByPlacehoderText등을 사용가능
    user.findByPlaceholderText(/password/i).type("1234123412");
    //.get(".text-lg")
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    user.window().its("localStorage.token").should("be.a", "string");

    //to do (can log in)
  });
});
