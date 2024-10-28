import { userLogOut } from "../handlers/user";
import {
  deleteMyMomentStateAt,
  setMomentsState,
} from "../store/slices/momentsReducer";
import { setIsServerReachable } from "../store/slices/utilityReducer";
import { MomentEndpoints } from "./endpoints";
import {
  deleteWithAuth,
  getUsingUserPositionData,
  getWithAuth,
  postFormDataWithAuth,
} from "./methods";

const {
  USER_MOMENTS,
  GET_USER_MOMENTS,
  USER_MOMENT_PARTICIPANTS,
  BUSINESS_MOMENTS,
} = MomentEndpoints;

/* USER MOMENTS */

export const getUserMoments = (data, callback) => (dispatch) => {
  const { offset } = data;
  const mode = offset == 0 ? "set" : "append";

  getUsingUserPositionData(GET_USER_MOMENTS, data)
    .then(({ data }) => {
      callback?.(true);
      dispatch(setMomentsState({ data, mode }));

      dispatch(setIsServerReachable(true));
    })
    .catch((error) => {
      callback?.();

      const status = error.response?.status;

      if (!status) {
        dispatch(setIsServerReachable(false));
        return;
      }

      /* Since this is the first request to server, use it to check if the user has been remove */
      if (status == 401 || status == 403) {
        dispatch(userLogOut({ isForced: true }));
      }

      console.log("[get-user-moments]:", error);
    });
};

export const createUserMoment = (data, callback, invalidCallback) => {
  postFormDataWithAuth(USER_MOMENTS, data)
    .then(({ data }) => {
      callback?.(data);
    })
    .catch((error) => {
      const status = error.response?.status;

      if (status == 406) {
        invalidCallback();
        return;
      }

      callback?.();
      console.log("[create-user-moment]", error);
    });
};

/* Get my moments as USER in 24 hours */
export const getMyMoments = (params, callback) => {
  getWithAuth(USER_MOMENTS, params)
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback(false);
      console.log("[get-my-moments]", e);
    });
};

export const deleteMyMoment = (momentId, callback) => (dispatch) => {
  deleteWithAuth(USER_MOMENTS, { id: momentId })
    .then(() => {
      callback(true);
      dispatch(deleteMyMomentStateAt(momentId));
    })
    .catch((e) => {
      callback(false);
      console.log("[delete-my-moment]", e);
    });
};

/* Get all the users who partecipate to a moment */
export const getUserMomentParticipants = ({ momentId, offset }, callback) => {
  getWithAuth(USER_MOMENT_PARTICIPANTS, { id: momentId, offset })
    .then(({ data }) => {
      callback(data);
    })
    .catch((error) => {
      callback(false);
      console.log("[get-users-who-partecipate-to-the-moment]", error);
    });
};

export const getBusinessMoments = ({ businessId, offset }, callback) => {
  getWithAuth(BUSINESS_MOMENTS, { businessId, offset })
    .then(({ data }) => {
      callback(data);
    })
    .catch((error) => {
      callback(false);
      console.log("[get-business-moments]", error);
    });
};
