import { gql } from "@apollo/client";

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    category {
      name
    }
    address
    isPromoted
  }
`;

//여러곳에서 반복 활용되는 type을 Fragment로 설정하고 불러와서 사용가능
/*
  사용하는 곳에서
  ...RestaurantParts 라고 GraphQL 구문안에 적고

  구문이 끝나는 부분에서 ${RESTAURANT_FRAGMENT}로 import시킴
*/

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`;
