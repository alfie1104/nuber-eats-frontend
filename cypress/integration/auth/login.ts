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
    // @ts-ignore
    user.login("1234@test.com", "1234123412");
  });
});
