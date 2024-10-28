import { setMyFeedMomentsState } from "../store/slices/momentsReducer";
import { appendProfile, setRecentUsers } from "../store/slices/profilesReducer";
import { setUser } from "../store/slices/userReducer";
import { ProfileEndpoints } from "./endpoints";
import { appendProfilePicture } from "./formatters/profileFormatters";
import {
  deleteWithAuth,
  getWithAuth,
  postWithAuth,
  putFormDataWithAuth,
  putWithAuth,
} from "./methods";

import axios from "axios";
import { isUndefined, pickBy } from "lodash";
import { querylimits } from "../constants";
import { saveUserProfilePicture } from "../handlers/business";

const FRIENDS_LIMIT = querylimits.TEN;

const {
  PROFILE_SETTINGS,
  USER_PROFILE,
  BLOCK_USER,
  SEARCH_USERS,
  CHANGE_PROFILE_PICTURE,
  USER_FEEDS,
  FRIEND_REQUEST,
  FRIEND,
  RECENT_USERS,
  UPDATE_LANGUAGE,
  SET_PUBLIC_KEY,
} = ProfileEndpoints;

export const getUserProfileByIdOrUsername =
  ({ user, isMine }) =>
  (dispatch) => {
    const params = pickBy(
      { user_id: user?.id, username: user?.username },
      (param) => !isUndefined(param)
    );

    getWithAuth(USER_PROFILE, params)
      .then(({ data }) => {
        if (isMine) {
          dispatch(setUser(data));
        } else {
          dispatch(appendProfile({ ...user, ...data }));
        }
      })
      .catch((error) => {
        console.log("get_user_profile:", error);
      });
  };

export const changeProfilePicture =
  ({ uri }, callback, invalidCallback) =>
  async (dispatch) => {
    let data = {};

    if (uri) {
      data = await appendProfilePicture(uri);
    }

    putFormDataWithAuth(CHANGE_PROFILE_PICTURE, data)
      .then(async ({ data }) => {
        await dispatch(saveUserProfilePicture({ picture: data.picture }));
        callback?.();
      })
      .catch((error) => {
        const statusCode = error.response?.status;

        if (statusCode == 406) {
          invalidCallback();
          return;
        }

        console.log("[change-profile-picture]", error);
      });
  };

export const blockUser = (userId, callback) => {
  putWithAuth(BLOCK_USER, { id: userId })
    .then(() => {
      callback(true);
    })
    .catch((e) => {
      callback(false);
      console.log("[block-user]", e);
    });
};

export const updateUserProfile = (data, callback) => (dispatch) => {
  putWithAuth(USER_PROFILE, data)
    .then(() => {
      callback?.(true);
      dispatch(setUser(data));
    })
    .catch((e) => {
      callback?.(false);
      console.log("[update-user-profile]", e);
    });
};

/* Handle place_id */

export const updateUserPlaceId = (placeId, callback) => {
  putWithAuth(USER_PROFILE, { latest_place_id: placeId })
    .then(() => {
      callback?.(true);
    })
    .catch((e) => {
      callback?.(false);
      console.log("[update-user-place-id]", e);
    });
};

/* Use to search user by username for taggin in story */
export const searchUsers = (options, callback) => {
  getWithAuth(SEARCH_USERS, options)
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback();
      console.log("[search-users]", e);
    });
};

/* Get my feeds, moments where I was tagged  params : { offset } */
export const getMyFeeds = (params, callback) => {
  getWithAuth(USER_FEEDS, params)
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback(null);
      console.log("[my-feeds]", e);
    });
};

/* Remove tag from moments where you've been tagged { moment_id } */
export const removeTagFromMyFeedMoment = (momentId, callback) => (dispatch) => {
  deleteWithAuth(USER_FEEDS, { id: momentId })
    .then(() => {
      dispatch(setMyFeedMomentsState({ momentId }));
      callback(true);
    })
    .catch((e) => {
      callback(false);
      console.log("[remove-tag-my-feed]", e);
    });
};

/* Update user settings */
export const updateProfileSettings = (settings, callback) => {
  postWithAuth(PROFILE_SETTINGS, { settings })
    .then(() => {
      callback?.();
    })
    .catch((e) => {
      callback?.(null);
      console.log("[update-profile-settings]", e);
    });
};

/* Handle friend request */
export const requestFriendship = (userId, callback) => {
  postWithAuth(FRIEND_REQUEST, { id: userId })
    .then(() => {
      callback(true);
    })
    .catch((e) => {
      callback(false);
      console.log("[request-friendship]", e);
    });
};

export const getFriendRequests = (offset, callback) => {
  getWithAuth(FRIEND_REQUEST, { offset, limit: FRIENDS_LIMIT })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback(null);
      console.log("[get-friend-requests]", e);
    });
};

export const deleteFriendRequest = (requestId, callback) => {
  deleteWithAuth(FRIEND_REQUEST, { request_id: requestId })
    .then(() => {
      callback(true);
    })
    .catch((e) => {
      callback(false);
      console.log("[delete-friend-request]", e);
    });
};

export const getUserFriends = ({ offset, limit = FRIENDS_LIMIT }, callback) => {
  getWithAuth(FRIEND, { offset, limit })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback(null);
      console.log("[get-user-friends]", e);
    });
};

export const getUserRecents = (callback) => (dispatch) => {
  getWithAuth(RECENT_USERS)
    .then(({ data }) => {
      dispatch(setRecentUsers(data));
      callback(true);
    })
    .catch((e) => {
      callback(null);
      console.log("[get-recent-users]", e);
    });
};

export const updateProfileLanguage = (language) => (dispatch) => {
  putWithAuth(UPDATE_LANGUAGE, { language })
    .then(() => {
      dispatch(setUser({ language }));
    })
    .catch((error) => {
      console.log("[update-profile-language]", error);
    });
};

/* Once the user has been logged-in or register, use its ID save the get or generated private key */

export const updateUserPublicKey = async (publicKey, authToken) => {
  try {
    await axios.post(
      SET_PUBLIC_KEY,
      { public_key: publicKey },
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );
  } catch (error) {
    console.log("[update-user-public-key]", error);
  }
};
