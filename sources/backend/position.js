import { pick } from "lodash";
import Geolocation from "react-native-geolocation-service";
import { setUserPosition } from "../store/slices/userReducer";
import { getUserRealPositionData } from "../store/store";
import { formatLocationData, reverseGeoCode } from "../utility/geolocation";

export const getUserCoordinate = (callback) => {
  Geolocation.getCurrentPosition(
    ({ coords }) => {
      const coordinate = pick(coords, ["longitude", "latitude"]);
      callback(coordinate);
    },
    ({ message }) => {
      callback(null);
      console.log("[get-current-location]", message);
    },
    {
      accuracy: "best",
      enableHighAccuracy: true,
    }
  );
};

export const getCurrentUserPosition = (callback) => (dispatch) => {
  getUserCoordinate((coordinate) => {
    if (!coordinate) {
      return;
    }

    /* To keep track if placeIs has changed */
    const { place_id: placeId } = getUserRealPositionData();

    reverseGeoCode({ ...coordinate, fields: ["bbox"] }, (location) => {
      if (location) {
        const newLocation = {
          ...formatLocationData(location),
          coordinate,
        };

        dispatch(setUserPosition(newLocation));

        let newPlaceId = null;

        if (newLocation.place_id !== placeId) {
          newPlaceId = newLocation.place_id;
        }

        callback({ placeId: newPlaceId });
      }
    });
  });
};
