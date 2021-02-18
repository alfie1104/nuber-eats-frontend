import { useReactiveVar } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "../apollo";
import { LoggedInRouter } from "../routers/logged-in-router";
import { LoggedOutRouter } from "../routers/logged-out-router";

/*
const IS_LOGGED_IN = gqladfasfdas`
  query isLoggedIn {
    isLoggedIn @client
  }
`;
*/

export const App = () => {
  /*
  const {
    data: { isLoggedIn },
  } = useQuery(IS_LOGGED_IN);
  */
  /* 
 local state를 reactiva variable을 이용하여 설정하였을 경우
 별도의 쿼리를 작성하지 않고도 useReactiveVar hook을 이용하여 값을 읽을 수 있다.
 */
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};
