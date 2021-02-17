import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImg,
  name,
  categoryName,
  id,
}) => {
  return (
    <Link to={`/restaurants/${id}`}>
      <div className="flex flex-col">
        <div
          className="py-32 bg-center mb-3"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></div>
        <h3 className="text-xl">{name}</h3>
        <span className="border-t- py-2 mt-3 text-xs opacity-50 border-gray-400">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};
