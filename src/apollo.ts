import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);

/*
  local state를 사용하기 위해 typePolicies옵션 정의.
  local state는 apollo query(혹은 mutation) 뒤에 @client를 붙임으로써 호출가능
*/

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

/*
  setContext는 모든 client가 만든 request의 context를 setting함
  이걸 이용해서 API서버에 request전송 시 헤더를 설정가능
*/
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": token || "",
    },
  };
});

/*
  여러 Link를 동시에 사용하기 위해서
  하나의 Link에서 concat함수를 호출하면서 인자로 다른 Link를 넣으면 됨
*/
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authToken();
            },
          },
        },
      },
    },
  }),
});
