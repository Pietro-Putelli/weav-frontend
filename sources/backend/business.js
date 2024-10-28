import { saveBusinessData } from "../handlers/business";
import { userLogOut } from "../handlers/user";
import {
  handleLikeBusinessState,
  setBusinessFeatures,
} from "../store/slices/businessesReducer";
import { setUser } from "../store/slices/userReducer";
import { numberize } from "../utility/functions";
import { BUSINESS_DOMAIN, BusinessEndpoints } from "./endpoints";
import {
  getWithAuth,
  getWithUserAuth,
  postFormDataWithUserAuth,
  postWithAuth,
  postWithAuthUsingPosition,
  putFormDataWithAuth,
  putWithAuth,
} from "./methods";

const {
  BUSINESS_CREATE,
  BUSINESS,
  BUSINESS_ID,
  SEARCH,
  BUSINESS_LIKE,
  BUSINESSES,
  TOP_RANKED,
  MY_BUSINESS,
  BUSINESS_SETTINGS,
} = BusinessEndpoints;

class BusinessAPI {
  static getById = (businessId, callback) => {
    postWithAuthUsingPosition(BUSINESS_ID, { id: businessId })
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback(false);
        console.log("[get-business-by-id]", e);
      });
  };

  static getTopRanked = (category, callback) => {
    postWithAuthUsingPosition(TOP_RANKED, { category: numberize(category.id) })
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback();
        console.log("[get-ranked-businesses]", e);
      });
  };

  static search = (options, callback) => {
    postWithAuthUsingPosition(SEARCH, options)
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback();
        console.log("[search-business]", e);
      });
  };

  static getFeatures = (mode) => (dispatch) => {
    getWithUserAuth(`${BUSINESS_DOMAIN}${mode}/`)
      .then(({ data }) => {
        dispatch(setBusinessFeatures({ data, mode }));
      })
      .catch((e) => {
        console.log("[get-venue-choices]", e);
      });
  };

  static get = (options, callback) => {
    postWithAuthUsingPosition(BUSINESSES, options)
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback?.();
        console.log("[get-businesses-list]", e);
      });
  };

  static handleLike = (businessId) => (dispatch) => {
    putWithAuth(BUSINESS_LIKE, { id: businessId })
      .then(() => {
        dispatch(handleLikeBusinessState(businessId));
      })
      .catch((e) => {
        console.log("[like-business]", e);
      });
  };

  static getLiked = (options, callback) => {
    postWithAuthUsingPosition(BUSINESS_LIKE, options)
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback();
        console.log("[get-business-liked]", e);
      });
  };

  /* Return current business if the owner has only one, or return the list */

  static getMine = (params, callback) => (dispatch) => {
    getWithAuth(MY_BUSINESS, params)
      .then(({ data }) => {
        callback?.(data);
      })
      .catch((error) => {
        const status = error.response?.status;

        if (status == 401 || status == 403) {
          dispatch(userLogOut({ isForced: true }));

          dispatch(setUser({ hasBusiness: false, isBusiness: true }));
        }

        if (status == 404) {
          callback?.();
        }

        console.log("[get-my-business-data]", error);
      });
  };

  static getOrCreate = (callback) => (dispatch) => {
    getWithAuth(MY_BUSINESS)
      .then(({ data }) => {
        callback(true);
        dispatch(saveBusinessData({ business: data }));
      })
      .catch((error) => {
        callback(null);
        console.log("[get-or-create-my-business]", error);
      });
  };

  static create = (data, callback) => {
    postFormDataWithUserAuth(BUSINESS_CREATE, data)
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback(null);
        console.log("[create-business]", e);
      });
  };

  static update = (data, callback) => {
    putFormDataWithAuth(BUSINESS, data)
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback(null);
        console.log("[update-business]", e);
      });
  };

  static updateSettings = (settings) => {
    postWithAuth(BUSINESS_SETTINGS, { settings })
      .then(() => {})
      .catch((e) => {
        console.log("[update-business-profile-settings]", e);
      });
  };
}

export default BusinessAPI;
