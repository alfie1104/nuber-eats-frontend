import React from "react";
import GoogleMapReact from "google-map-react";

export const Dashboard = () => {
  return (
    <div>
      <div className="py-52 bg-gray-800 ">
        <GoogleMapReact bootstrapURLKeys={{ key: "" }}>
          <h1>hello</h1>
        </GoogleMapReact>
      </div>
    </div>
  );
};
