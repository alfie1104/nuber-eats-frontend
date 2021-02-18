import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

const ClientRoutes = [
  <Route path="/" exact key="restaurant">
    <Restaurants />
  </Route>,
  <Route path="/confirm" exact key="confirm">
    <ConfirmEmail />
  </Route>,
  <Route path="/edit-profile" exact key="edit-profile">
    <EditProfile />
  </Route>,
  <Route path="/search" exact key="search">
    <Search />
  </Route>,
  <Route path="/category/:slug" exact key="category">
    <Category />
  </Route>,
  <Route path="/restaurants/:id" exact key="restaurants">
    <Restaurant />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  //Header에서 Link컴포넌트를 사용하기위해 Header를 Router안에 위치시킴
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        {data.me.role !== "Client" && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
