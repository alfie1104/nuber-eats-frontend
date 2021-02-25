import { ApolloProvider } from "@apollo/client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Login } from "../login";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { LOGIN_MUTATION } from "../login";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();

      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      );
    });
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
    //const email = getByPlaceholderText("Email");
    const email = getByPlaceholderText(/email/i); //대소문자를 구분하지 않고 email을 검색하기 위해 / /i (insensitive) 정규표현식 사용
    await waitFor(() => {
      userEvent.type(email, "this@wont");
    });

    //getByText("Please enter a valid email")
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

    await waitFor(() => {
      userEvent.clear(email);
    });

    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it("display password required errors", async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitButton = getByRole("button");

    await waitFor(() => {
      userEvent.type(email, "this@wont.com");
      userEvent.click(submitButton);
    });

    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitButton = getByRole("button");

    const formData = {
      email: "real@test.com",
      password: "12345678901",
    };

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: null,
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitButton);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
  });
});
