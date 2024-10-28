import axios from "axios";
import { isUndefined, omitBy } from "lodash";
import { Platform } from "react-native";
import { setLoginData } from "../store/slices/utilityReducer";
import { getLanguage } from "../store/store";
import { formatPhone } from "../utility/formatters";
import { UserEndpoints } from "./endpoints";
import { postFormDataWithUserAuth } from "./methods";

const {
  CHECK_USERNAME_EXISTENCE,
  REQUEST_LOGIN_OTP,
  VERIFY_LOGIN_OTP,

  PHONE_SIGN_UP,
  LOGIN_WITH_TOKEN,
  USERNAME_SIGN_UP,

  LOGIN_AS_BUSINESS,
  ACCEPT_TERMS,
} = UserEndpoints;

class UserAPI {
  static requestOTP = (phone, callback) => (dispatch) => {
    const phoneNumber = formatPhone({ phone, isPlain: true });

    axios
      .get(REQUEST_LOGIN_OTP, { params: { phone: phoneNumber } })
      .then(({ data }) => {
        const sid = data?.sid;

        if (sid) {
          dispatch(setLoginData({ sid }));
        }

        callback?.({ isSent: !!sid });
      })
      .catch((error) => {
        const status = error?.response?.status;

        callback({ isSent: false, isBlocked: status === 403 });
        console.log("[request-login-otp]", error);
      });
  };

  static verifyOTP = (data, callback) => {
    const { phone, otp, sid } = data;

    const phoneNumber = formatPhone({ phone, isPlain: true });

    axios
      .post(VERIFY_LOGIN_OTP, { phone: phoneNumber, otp, sid })
      .then(({ data }) => {
        const business = data?.business;
        const acceptedTerms = data?.accepted_terms;

        callback({
          isVerified: true,
          user: data?.user ?? data,
          business,
          acceptedTerms,
        });
      })
      .catch((error) => {
        callback({ isVerified: false });
        console.log("[verify-login-otp]", error);
      });
  };

  static signUp = (data, callback) => {
    axios
      .post(PHONE_SIGN_UP, data, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (formData) => formData,
      })
      .then(({ data }) => {
        callback(data);
      })
      .catch((error) => {
        callback(false);
        console.log("[sign-up-user]", error);
      });
  };

  static signUpWithUsername = (data, callback) => {
    postFormDataWithUserAuth(USERNAME_SIGN_UP, data)
      .then(({ data }) => {
        callback(data);
      })
      .catch((error) => {
        callback(false);
        console.log("[sign-up-username]", error);
      });
  };

  static loginAsBusiness = (data, callback) => {
    const { phone, name } = data;

    const language = getLanguage();
    const osType = String(Platform.OS).toUpperCase();

    axios
      .post(LOGIN_AS_BUSINESS, { phone, name, language, os_type: osType })
      .then(({ data }) => {
        callback(data);
      })
      .catch((error) => {
        callback(false);
        console.log("[login-as-business]", error);
      });
  };

  static loginWithToken = (token, callback) => {
    axios
      .get(LOGIN_WITH_TOKEN, { headers: { Authorization: `Token ${token}` } })
      .then(({ data }) => {
        callback(data);
      })
      .catch((error) => {
        callback(null);
        console.log("[login-with-token]", error);
      });
  };

  static checkUsernameExistence = (data, callback) => {
    const params = omitBy(data, isUndefined);

    axios
      .get(CHECK_USERNAME_EXISTENCE, { params })
      .then(() => {
        callback(true);
      })
      .catch((error) => {
        callback(false);
        console.log("[check-username-existence]", error);
      });
  };

  static acceptTermsForBusiness = (authToken, callback) => {
    axios
      .put(
        ACCEPT_TERMS,
        {},
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      )
      .then(() => {
        callback(true);
      })
      .catch((error) => {
        callback(false);
        console.log("[accept-terms]", error);
      });
  };
}

export default UserAPI;
