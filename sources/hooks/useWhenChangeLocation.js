/* delta is expressed in meters */

import { useEffect, useState } from "react";
import useUser from "./useUser";
import { getUserCoordinate } from "../backend/position";
import { getDistance } from "../utility/geolocation";

const useWhenChangeLocation = ({ delta }, callback) => {
  const { coordinate } = useUser();

  useEffect(() => {
    getUserCoordinate((newCoordinate) => {
      const distance = getDistance({
        coordinate1: coordinate,
        coordinate2: newCoordinate,
      });

      if (distance >= delta) {
        callback();
      }
    });
  }, []);
};

export default useWhenChangeLocation;
