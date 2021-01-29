import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false);

/*
  local state를 사용하기 위해 typePolicies옵션 정의.
  local state는 apollo query(혹은 mutation) 뒤에 @client를 붙임으로써 호출가능
*/
export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
        },
      },
    },
  }),
});
