import { render, waitFor } from "@testing-library/react";
import React from "react";
import { isLoggedInVar } from "../../apollo";
import { App } from "../app";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    const { debug, getByText } = render(<App />);
    getByText("logged-out");
    //debug(); //debug는 렌더링한 컴포넌트가 어떻게 생겼는지(html태그) 보여줌
  });

  it("renders LggedInRouter", async () => {
    const { getByText, debug } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });

    //debug();
    getByText("logged-in");
  });
});
