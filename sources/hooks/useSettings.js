import { useDispatch, useSelector } from "react-redux";
import BusinessAPI from "../backend/business";
import { updateProfileSettings } from "../backend/profile";
import { setCurrentBusiness } from "../store/slices/businessesReducer";
import {
  getBusinessSettingsState,
  getUserSettingsState,
  setBusinessProfileSettings,
  setUserProfileSettings,
} from "../store/slices/settingsReducer";
import useCurrentBusiness from "./useCurrentBusiness";

const useSettings = () => {
  const { isBusiness, business } = useCurrentBusiness();
  const selector = isBusiness ? getBusinessSettingsState : getUserSettingsState;

  const settings = useSelector(selector);

  const dispatch = useDispatch();

  const update = (newSettings) => {
    if (!isBusiness) {
      updateProfileSettings(newSettings);
      dispatch(setUserProfileSettings(newSettings));
    } else {
      BusinessAPI.updateSettings(newSettings);
      dispatch(setBusinessProfileSettings(newSettings));
    }
  };

  const changeNotifications = (setting) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings?.notifications,
        ...setting,
      },
    };

    update(newSettings);
  };

  const changeMessages = () => {
    if (isBusiness) {
      const chatSettings = { allow_chat: !business.allow_chat };

      dispatch(setCurrentBusiness(chatSettings));
      BusinessAPI.updateSettings(chatSettings);
    } else {
    }
  };

  const changeChance = (setting) => {
    const newSettings = {
      ...settings,
      chance: {
        ...settings?.chance,
        ...setting,
      },
    };

    update(newSettings);
  };

  return {
    isBusiness,
    settings,
    changeNotifications,
    changeMessages,
    changeChance,
  };
};

export default useSettings;
