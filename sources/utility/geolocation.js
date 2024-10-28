import { MAP_BOX_API_KEY } from "@env";
import * as turf from "@turf/turf";
import axios from "axios";
import _ from "lodash";

export const geoCode = ({ value, types }, callback) => {
  const placeName = encodeURIComponent(value);

  // place, locality, neighborhood
  let stringTypes = types.join("%2C");
  const requestUri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeName}.json?limit=10&proximity=ip&types=${stringTypes}&fuzzyMatch=true&access_token=${MAP_BOX_API_KEY}`;

  axios
    .get(requestUri)
    .then(({ data }) => {
      const features = data.features;
      const places = features.map((feature) => {
        return {
          place_name: feature.place_name,
          id: feature.id,
          text: feature.text,
          bbox: feature.bbox,
          coordinate: {
            longitude: feature.center[0],
            latitude: feature.center[1],
          },
        };
      });
      callback(places);
    })
    .catch((e) => {
      console.log("[geo-code]", e);
    });
};

export const reverseGeoCode = (
  { longitude, latitude, fields = [] },
  callback
) => {
  const requestUri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=place&limit=1&access_token=${MAP_BOX_API_KEY}`;

  axios
    .get(requestUri)
    .then(({ data }) => {
      const feature = data.features?.[0];

      if (feature) {
        const location = _.pick(feature, ["id", "text", ...fields]);
        callback(location);
      } else {
        callback();
      }
    })
    .catch((e) => {
      console.log("[reverse-geo-code]", e);
    });
};

const getBBoxArea = (bbox) => {
  const [swLong, swLat, neLong, neLat] = bbox;

  const A = [swLong, swLat];
  const B = [neLong, neLat];
  const C = [neLong, swLat];
  const D = [swLong, swLat];

  const polygon = turf.polygon([[A, B, C, D, A]]);
  const squareMetersArea = turf.area(polygon);
  const squareKMetersArea = squareMetersArea / 1000000;

  return squareKMetersArea.toFixed(2);
};

/*
  Use this to know if the current place's bbox is a city, based on the
  approximate assumption that BBOX_AREA < 50km^2 is not a city.
*/

export const getIsCity = (bbox) => {
  const area = getBBoxArea(bbox);
  return area > 50;
};

export const formatLocationData = (location) => {
  return {
    coordinate: location.coordinate,
    is_city: getIsCity(location.bbox),
    city: location.text,
    place_id: location.id,
  };
};

export const getDistance = ({ coordinate1, coordinate2, formatted }) => {
  const point1 = turf.point([coordinate1.longitude, coordinate1.latitude]);
  const point2 = turf.point([coordinate2.longitude, coordinate2.latitude]);

  const distanceInMeters = turf.distance(point1, point2, { units: "meters" });
  const distanceInKiloMeters = distanceInMeters / 1000;

  if (formatted) {
    if (distanceInKiloMeters < 1) {
      return String(distanceInMeters.toFixed(0)) + " m";
    }
    return String(distanceInKiloMeters.toFixed(1)) + " Km";
  }

  return distanceInMeters;
};
