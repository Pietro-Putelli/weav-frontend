import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_SETTINGS_REDUCER } from "../initialStates";

const settings = createSlice({
  name: "settings",
  initialState: INITIAL_SETTINGS_REDUCER,
  reducers: {
    setUserProfileSettings: (state, action) => {
      state.userSettings = {
        ...state.userSettings,
        ...action.payload,
      };
    },

    setBusinessProfileSettings: (state, action) => {
      state.businessSettings = {
        ...state.businessSettings,
        ...action.payload,
      };
    },

    setTutorial: (state, action) => {
      state.tutorial = {
        ...state.tutorial,
        ...action.payload,
      };
    },

    cleanSettingState: (state, _) => {
      state.userSettings = INITIAL_SETTINGS_REDUCER.userSettings;
      state.businessSettings = INITIAL_SETTINGS_REDUCER.businessSettings;
      state.tutorial = INITIAL_SETTINGS_REDUCER.tutorial;
      state.spots = INITIAL_SETTINGS_REDUCER.spots;
    },
  },
});

export const {
  setTutorial,
  setUserProfileSettings,
  setBusinessProfileSettings,
  setBusinessNotification,
  cleanSettingState,
} = settings.actions;

export const getUserSettingsState = (state) => {
  return state.settings.userSettings;
};

export const getBusinessSettingsState = (state) => {
  return state.settings.businessSettings;
};

export const getTutorialState = (state) => {
  return state.settings.tutorial;
};

export default settings.reducer;
