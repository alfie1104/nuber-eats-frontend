import { ApolloProvider } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, waitFor, RenderResult } from "../../test-utils";
import { UserRole } from "../../__generated__/globalTypes";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";

const mockPush = jest.fn();
//react-router-dom 라이브러리의 useHistory 함수를 mocking함
jest.mock("react-router-dom", () => {
  //requireActual함수를 이용하여 실제 react-router-dom 라이브러리를 가져옴
  const realModule = jest.requireActual("react-router-dom");

  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Creact Account | Nuber Eats");
    });
  });

  it("renders validation errors", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "wont@work");
    });

    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);

    await waitFor(() => {
      userEvent.type(email, "working@email.com");
      userEvent.click(button);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it("submits mutation with form values", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");

    const formData = {
      email: "working@mail.com",
      password: "123123123123",
      role: UserRole.Client,
    };

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });

    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );

    jest.spyOn(window, "alert").mockImplementation(() => null); //window.alert가 본래 기능 대신 null을 return하는 함수가 되도록 변경

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });

    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(window.alert).toHaveBeenLastCalledWith(
      "Account Created! Log in now!"
    );
    const mutationError = getByRole("alert");
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mutationError).toHaveTextContent("mutation-error");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
