describe("Create Account", () => {
  const user = cy;

  it("should see email / password validation errors", () => {
    user.visit("/");
    user.findByText(/create an account/i).click();
    user.findByPlaceholderText(/email/i).type("non@good");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("eafae@test.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;

      if (operationName && operationName === "createAccountMutation") {
        //현재 받은 요청이 createAccountMutation이면 요청을 가로채서 결과를 바꿈(마치 성공한 것 처럼)
        req.reply((res) => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });

    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("real2@test.com");
    user.findByPlaceholderText(/password/i).type("1234123412");
    user.findByRole("button").click();
    user.wait(1000);

    // @ts-ignore
    user.login("real2@test.com", "1234123412");
  });
});
