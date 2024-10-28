import {
  createMySpotState,
  deleteMySpotState,
  setMySpotsState,
  updateSpotState,
} from "../store/slices/spotsReducer";
import { SpotEndpoints } from "./endpoints";
import {
  deleteWithAuth,
  getWithAuth,
  postWithAuth,
  putWithAuth,
} from "./methods";

const { ROOT_SPOT, REPLY_SPOT, GET_MY_SPOTS, GET_SPOT_REPLIES } = SpotEndpoints;

class SpotsAPI {
  static getByBusinessId = (params, callback) => {
    getWithAuth(ROOT_SPOT, params)
      .then(({ data }) => {
        callback(data);
      })
      .catch((error) => {
        callback(false);

        console.log("[SPOTS] [getByBusinessId]", error);
      });
  };

  static createMine = (data, callback) => (dispatch) => {
    postWithAuth(ROOT_SPOT, data)
      .then(({ data }) => {
        callback(data);

        dispatch(createMySpotState(data));
      })
      .catch((error) => {
        callback(false);
        console.log("[SPOTS] [createMySpot]", error);
      });
  };

  static getMine = (callback) => (dispatch) => {
    getWithAuth(GET_MY_SPOTS)
      .then(({ data }) => {
        callback(data);

        dispatch(setMySpotsState(data));
      })
      .catch((error) => {
        callback(false);
        console.log("[SPOTS] [getMySpots]", error);
      });
  };

  static deleteMine = (spotId, callback) => (dispatch) => {
    deleteWithAuth(ROOT_SPOT, { spotId })
      .then(() => {
        callback?.(true);

        dispatch(deleteMySpotState(spotId));
      })
      .catch((error) => {
        callback?.(null);
        console.log("[SPOTS] [deleteMySpot]", error);
      });
  };

  static reply = (spotId, callback) => {
    putWithAuth(REPLY_SPOT, { spotId })
      .then(() => {
        callback(true);

        // dispatch(updateSpotState({ spotId, data: { is_replied: true } }));
      })
      .catch((error) => {
        callback(false);
        console.log("[SPOTS] [reply]", error);
      });
  };

  static getReplies = ({ spotId, offset }, callback) => {
    getWithAuth(GET_SPOT_REPLIES, { spotId })
      .then(({ data }) => {
        callback(data);
      })
      .catch((error) => {
        callback(false);
        console.log("[SPOTS] [getReplies]", error);
      });
  };
}

export default SpotsAPI;
