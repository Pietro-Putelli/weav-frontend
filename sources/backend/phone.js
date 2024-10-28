import { UserEndpoints } from "./endpoints";
import { postWithAuth } from "./methods";

const { VERIFY_OTP, REQUEST_OTP } = UserEndpoints;

export const request_otp = (options, callback) => {
  postWithAuth(REQUEST_OTP, options)
    .then(({ data: { token_value } }) => {
      callback(token_value);
    })
    .catch((e) => {
      callback();
      console.log("[request-otp]", e);
    });
};

export const verify_otp = (options, callback) => {
  postWithAuth(VERIFY_OTP, options)
    .then(() => {
      callback(true);
    })
    .catch((e) => {
      callback(false);
      console.log("[verify-otp]", e);
    });
};
