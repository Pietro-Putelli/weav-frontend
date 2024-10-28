import { Keyboard } from "react-native";
import { deviceLogout, updateDeviceAccountType } from "../backend/devices";
import { USER_DOMAIN } from "../backend/endpoints";
import { deleteWithAuth } from "../backend/methods";
import { getCurrentUserPosition } from "../backend/position";
import { updateUserPlaceId } from "../backend/profile";
import UserAPI from "../backend/user";
import { closeWebSocket } from "../hooks/useSharedWebSocket";
import { navigateToFirstScreen, setRootScreen } from "../navigation/actions";
import {
  clearBusinessState,
  setCurrentBusiness,
} from "../store/slices/businessesReducer";
import { clearEventsState } from "../store/slices/eventsReducer";
import { clearFeedState } from "../store/slices/feedsReducer";
import { clearMomentState } from "../store/slices/momentsReducer";
import { clearSecretInfo, setSecretInfo } from "../store/slices/secretReducer";
import {
  cleanSettingState,
  setUserProfileSettings,
} from "../store/slices/settingsReducer";
import { clearUserState, setUser } from "../store/slices/userReducer";
import { cleanUtilityState } from "../store/slices/utilityReducer";
import storage from "../store/storage";
import { getUserSecretInfoFromStore } from "../store/store";
import { flushBusinessData } from "./business";
import { switchingProfile } from "./utility";

export const setIsUserLogged = (isLogged) => {
  storage.set("is_logged", isLogged);
};

export const getIsUserLogged = () => {
  return storage.getBoolean("is_logged");
};

/* Handle user position at the beginning */
export const setupUserPosition = () => (dispatch) => {
  dispatch(
    getCurrentUserPosition(({ placeId }) => {
      if (placeId) {
        updateUserPlaceId(placeId);
      }
    })
  );
};

/* Using during the login process */
export const saveUserLoginData = (data, callback) => async (dispatch) => {
  const {
    settings,
    auth_token: userToken,
    has_business: hasBusiness,
    has_multiple_businesses: hasMultipleBusinesses,
    ...userData
  } = data;

  dispatch(setSecretInfo({ userToken }));

  dispatch(
    setUser({
      ...userData,
      hasBusiness,
      hasProfile: true,
      isBusiness: false,
      hasMultipleBusinesses,
    })
  );

  dispatch(setUserProfileSettings(settings));

  dispatch(setCurrentBusiness(null));

  setIsUserLogged(true);

  setRootScreen();

  callback?.();
};

/* When user logs-out clean all data */
export const userLogOut =
  ({ isForced } = {}) =>
  (dispatch) => {
    closeWebSocket();

    if (isForced) {
      dispatch(clearSecretInfo());
    } else {
      deviceLogout();
    }

    navigateToFirstScreen(() => {
      [
        clearUserState,
        clearMomentState,
        clearBusinessState,
        cleanSettingState,
        cleanUtilityState,
        clearFeedState,
        clearEventsState,
      ].forEach((func) => {
        dispatch(func());
      });

      setIsUserLogged(false);
    });
  };

/* Delete User's Account */

export const deleteUserAccount = async () => {
  deleteWithAuth(USER_DOMAIN)
    .then(async () => {
      closeWebSocket();

      userLogOut({ isForced: true });

      navigateToFirstScreen();
    })
    .catch((error) => {
      console.log("[delete-user]", error);
    });
};

export const switchToPersonalProfile =
  ({ hasProfile, userId, secretInfo }, createUserCallback) =>
  (dispatch) => {
    console.log({ hasProfile, userId, secretInfo });

    if (hasProfile) {
      switchingProfile();

      /* If the UserProfile exists but not on local memory */
      if (userId === null) {
        UserAPI.loginWithToken(secretInfo.userToken, (user) => {
          if (user) {
            dispatch(saveUserLoginData({ ...user, isBusiness: false }));
          }
        });
      } else {
        updateDeviceAccountType(false, () => {
          dispatch(setUser({ isBusiness: false }));

          setTimeout(() => {
            dispatch(flushBusinessData());
          }, 100);
        });
      }
    } else {
      createUserCallback?.();
    }
  };

export const loginIfAccountExists = (callback) => {
  const { userToken } = getUserSecretInfoFromStore();

  if (userToken) {
    Keyboard.dismiss();

    UserAPI.loginWithToken(userToken, (user) => {
      if (user) {
        callback(user);
      }
    });
  }
};
