import { GOOGLE_CLIENT_ID } from "@env";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { UserEndpoints } from "./endpoints";

const { VERIFY_SOCIAL_LOGIN, SOCIAL_LOGIN } = UserEndpoints;

class SocialLoginAPI {
  static verifyToken = (method, beginCallback, callback) => {
    (method == "google" ? this.google : this.apple)(beginCallback, callback);
  };

  static completeVerification = (data, callback) => {
    const { token, name, method } = data;

    axios
      .post(VERIFY_SOCIAL_LOGIN, { token, method })
      .then(({ data }) => {
        callback({ ...data, name });
      })
      .catch((error) => {
        callback(null);
        console.log("[verify-social-login]", error);
      });
  };

  static google = async (beginCallback, callback) => {
    GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID });

    try {
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();

      beginCallback();

      const token = userData.idToken;

      const user = userData.user;
      const { givenName, familyName } = user;

      let name = "";
      if (givenName) {
        name += givenName;
      }

      if (familyName) {
        name += " " + familyName;
      }

      setTimeout(() => {
        this.completeVerification({ token, name, method: "google" }, callback);
      }, 200);
    } catch (error) {
      console.log("[google-auth]", error);
      callback(null);
    }
  };

  static apple = async (beginCallback, callback) => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      beginCallback();

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const { authorizationCode, fullName } = appleAuthRequestResponse;

        let name = null;

        if (fullName.givenName && fullName.familyName) {
          name = `${fullName.givenName} ${fullName.familyName}`;
        }

        setTimeout(() => {
          this.completeVerification(
            { token: authorizationCode, name, method: "apple" },
            callback
          );
        }, 200);
      } else {
        callback(null);
        console.log("[apple-auth]", "User is not authorized");
      }
    } catch (error) {
      console.log("[apple-auth]", error);
      callback(null);
    }
  };

  static login = (data, callback) => {
    axios
      .post(SOCIAL_LOGIN, data, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (formData) => formData,
      })
      .then(({ data: userData }) => {
        callback(userData);
      })
      .catch((e) => {
        console.log("[login-with]", e);
        callback(null);
      });
  };
}

export default SocialLoginAPI;
