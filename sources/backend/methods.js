import axios from "axios";
import { getTokenForRequest, getUserPositionData } from "../store/store";

const Authorization = (forceUser) => {
  const token = getTokenForRequest(forceUser);

  return `Token ${token}`;
};

export const postWithAuth = (url, data, headers) => {
  return axios.post(url, data, {
    headers: {
      Authorization: Authorization(),
      ...headers,
    },
  });
};

export const postWithUserAuth = (url, data) => {
  return postWithAuth(url, data, {
    Authorization: Authorization(true),
  });
};

export const putWithAuth = (url, data, headers) => {
  return axios.put(url, data, {
    headers: {
      Authorization: Authorization(),
      ...headers,
    },
  });
};

export const putWithUserAuth = (url, data) => {
  return putWithAuth(url, data, {
    Authorization: Authorization(true),
  });
};

export const getWithAuth = (url, params, headers) => {
  return axios.get(url, {
    headers: {
      Authorization: Authorization(),
      ...headers,
    },
    params,
  });
};

export const getWithUserAuth = (url, params) => {
  return getWithAuth(url, params, {
    Authorization: Authorization(true),
  });
};

export const deleteWithAuth = (url, params, headers) => {
  return axios.delete(url, {
    headers: {
      Authorization: Authorization(),
      ...headers,
    },
    params,
  });
};

export const postWithAuthUsingPosition = (url, data) => {
  const positionData = getUserPositionData();

  return axios.post(
    url,
    { ...positionData, ...data },
    { headers: { Authorization: Authorization() } }
  );
};

/*
  Pass coordinate is the user is not in a city, otherwise pass place_id
*/

export const getUsingUserPositionData = (url, data, options = {}) => {
  const { coordinate, place_id, is_city } = getUserPositionData();

  const newData = { place_id };

  if (!is_city || options?.coordinate) {
    newData.coordinate = coordinate;
  }

  return postWithAuth(url, { ...newData, ...data });
};

export const postFormDataWithAuth = (url, data, headers) => {
  return axios.post(url, data, {
    headers: {
      Authorization: Authorization(),
      "Content-Type": "multipart/form-data",
      ...headers,
    },
    transformRequest: (formData) => formData,
  });
};

export const postFormDataWithUserAuth = (url, data) => {
  return postFormDataWithAuth(url, data, {
    Authorization: Authorization(true),
  });
};

export const putFormDataWithAuth = (url, data, headers) => {
  return axios.put(url, data, {
    headers: {
      Authorization: Authorization(),
      "Content-Type": "multipart/form-data",
      ...headers,
    },
    transformRequest: (formData) => formData,
  });
};
