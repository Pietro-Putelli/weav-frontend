import { size } from "lodash";
import { EventRegister } from "react-native-event-listeners";
import BusinessAPI from "../backend/business";
import { eventlisteners } from "../constants";
import { SCREENS } from "../constants/screens";
import { convertTimetableForBusiness } from "../dates/timetable";
import { showSheetNavigation } from "../navigation/actions";
import {
  setCurrentBusiness,
  setMyBusinesses,
} from "../store/slices/businessesReducer";
import { flushInsights } from "../store/slices/insightsReducer";
import { setSecretInfo } from "../store/slices/secretReducer";
import { setBusinessProfileSettings } from "../store/slices/settingsReducer";
import { setUser } from "../store/slices/userReducer";
import { getState } from "../store/store";
import { convertToBase64FromUrl } from "../utility/filesystem";
import { setIsUserLogged } from "./user";
import { switchingProfile } from "./utility";

export const flushBusinessData = () => (dispatch) => {
  dispatch(setCurrentBusiness(null));
  dispatch(flushInsights());
};

export const saveBusinessData = (data, callback) => async (dispatch) => {
  const { user, business } = data;

  const userToken = user?.auth_token;
  const businessToken = business?.auth_token;

  dispatch(setSecretInfo({ userToken, businessToken }));

  let userProps = { ...user, hasBusiness: true, isBusiness: true };

  if (user) {
    userProps.hasMultipleBusinesses = user?.has_multiple_businesses;
  }

  if (business?.has_user_profile !== undefined) {
    userProps.hasProfile = business?.has_user_profile;
  }

  /* Set User shared info */
  dispatch(setUser(userProps));

  setIsUserLogged(true);

  if (businessToken) {
    const { settings, ...businessData } = business;

    const newTimetable = convertTimetableForBusiness(businessData.timetable);
    const formattedBusiness = { ...businessData, timetable: newTimetable };

    dispatch(setCurrentBusiness(formattedBusiness));
    dispatch(setBusinessProfileSettings(settings));
  } else {
    dispatch(setCurrentBusiness());
  }

  callback?.();
};

export const createBusinessState = (business) => async (dispatch) => {
  const {
    auth_token: businessToken,
    has_user_profile: hasProfile,
    settings,
    ...businessData
  } = business;

  EventRegister.emit(eventlisteners.MOVE_TO_HOME, { tabIndex: 0 });

  /* Update user */
  dispatch(setUser({ hasBusiness: true, isBusiness: true, hasProfile }));

  dispatch(setSecretInfo({ businessToken }));
  dispatch(setCurrentBusiness({ is_approved: false, ...businessData }));
  dispatch(setBusinessProfileSettings(settings));
};

export const saveUserProfilePicture =
  ({ picture }) =>
  async (dispatch) => {
    const base64Picture = await convertToBase64FromUrl(picture);
    dispatch(setUser({ picture: base64Picture }));
  };

/* Use to completely delete business */
export const deleteCurrentBusiness = () => async (dispatch) => {
  const { currentBusiness } = getState("business");

  /* Update user */
  dispatch(setUser({ hasBusiness: false }));
};

/* Switch to user's current business */
export const switchToBusiness = () => (dispatch) => {
  const { myBusinesses } = getState("business");
  const hasMultipleBusinesses = size(myBusinesses) > 1;

  const { user } = getState("user");

  if (!hasMultipleBusinesses && !user.hasMultipleBusinesses) {
    switchingProfile();

    const business = myBusinesses?.[0];

    if (business) {
      dispatch(saveBusinessData({ business }));
    } else {
      dispatch(
        BusinessAPI.getMine({}, (data) => {
          if (data) {
            dispatch(setMyBusinesses(data));

            dispatch(saveBusinessData({ business: data[0] }));
          }
        })
      );
    }
  } else {
    showSheetNavigation({ screen: SCREENS.MyProfilesList });
  }
};
