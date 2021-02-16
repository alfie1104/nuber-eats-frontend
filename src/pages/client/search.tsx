import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { gql, useLazyQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      //history.push("/");
      //push와 다르게 replace는 history에 기록을 남기지 않음. 현재 페이지를 그냥 새로운 페이지로 대체해버림
      return history.replace("/");
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location]);

  console.log(loading, data, called);

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <h1>Search Page</h1>
    </div>
  );
};
