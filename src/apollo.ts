import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      "x-jwt": authTokenVar() || "",
    },
  },
});

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
      "x-jwt": authTokenVar() || "",
    },
  };
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    /* 
    상황에 따라서 적절한 Link (Websocket 혹은 http)를 연결시켜주도록 설정 
    아래 return값이 true 일 경우, wsLink를 사용하게 되고
    false일 경우 authLink를 사용하게 됨
    */
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);
/*
  여러 Link를 동시에 사용하기 위해서
  하나의 Link에서 concat함수를 호출하면서 인자로 다른 Link를 넣으면 됨
*/
export const client = new ApolloClient({
  link: splitLink,
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
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
