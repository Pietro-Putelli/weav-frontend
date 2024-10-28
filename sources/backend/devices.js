import { setDeviceToken } from "../store/slices/userReducer";
import { DEVICE_DOMAIN, DeviceEndpoints } from "./endpoints";
import { putWithUserAuth } from "./methods";
import { getDeviceType } from "../utility/device";

const { DEVICE_LOGOUT } = DeviceEndpoints;

/* Update device state to logout */
export const deviceLogout = (callback) => {
  putWithUserAuth(DEVICE_LOGOUT)
    .then(() => {
      callback?.(true);
    })
    .catch((e) => {
      callback?.(false);
      console.log("[device-logout] ", e);
    });
};

/* Update device token */
export const updateDeviceToken = (token) => (dispatch) => {
  const osType = getDeviceType();

  putWithUserAuth(DEVICE_DOMAIN, { token, os_type: osType })
    .then(() => {
      dispatch(setDeviceToken(token));
    })
    .catch((e) => {
      console.log("[update-device-token]", e);
    });
};

/* Update device state to keep track if the user is logged as business or not */
export const updateDeviceAccountType = (isBusiness, callback) => {
  putWithUserAuth(DEVICE_DOMAIN, { is_business: isBusiness })
    .then(callback)
    .catch((e) => {
      console.log("[update-device-account-type]", e);
    });
};
