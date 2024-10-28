import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_USER_REDUCER, INITIAL_USER_POSITION } from "../initialStates";

const user = createSlice({
  name: "user",
  initialState: INITIAL_USER_REDUCER,
  reducers: {
    /* USER PROFILE */
    setUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    setPermissionsGranted(state, { payload }) {
      state.permissionsGranted = {
        ...state.permissionsGranted,
        ...payload,
      };
    },

    /* USER POSITION  */
    setUserPosition(state, action) {
      state.position = {
        ...state.position,
        ...action.payload,
      };

      state.fakePosition = INITIAL_USER_POSITION;
    },

    cleanUserPositionInfo(state, _) {
      state.permissionsGranted.location = false;
      state.position = INITIAL_USER_REDUCER.position;
    },

    setDeviceToken(state, action) {
      state.deviceToken = { value: action.payload, isSent: true };
    },

    setFakeUserPosition(state, action) {
      if (action.payload == null) {
        state.fakePosition = INITIAL_USER_POSITION;
      } else {
        state.fakePosition = {
          ...state.fakePosition,
          ...action.payload,
        };
      }
    },

    setIsUserPositionLoaded(state, action) {
      state.isUserPositionLoaded = action.payload;
    },

    clearUserState: (state, _) => {
      state.user = {
        ...INITIAL_USER_REDUCER.user,
        language: state.user.language,
        permissionsGranted: state.user.permissionsGranted,
      };
      state.position = INITIAL_USER_REDUCER.position;
      state.settings = INITIAL_USER_REDUCER.settings;
      state.fakePosition = INITIAL_USER_REDUCER.fakePosition;
      state.isUserPositionLoaded = INITIAL_USER_REDUCER.isUserPositionLoaded;
      state.deviceToken.isSent = false;
    },
  },
});

/* USER PROFILE */

export const {
  setUser,
  setUserPosition,
  setPermissionsGranted,
  cleanUserPositionInfo,
  setFakeUserPosition,
  setDeviceToken,
  setIsUserPositionLoaded,
  clearUserState,
} = user.actions;

export const getUser = (state) => state.user.user;

export const getUserLanguage = (state) => {
  return state.user.user.language;
};

export const getUserPosition = (state) => state.user.position;

export const getPermissionsGranted = (state) => state.user.permissionsGranted;

export const getPermissionsGrantedCamera = (state) => {
  const { camera, media } = state.user.permissionsGranted;

  return camera && media;
};

export const getUserFakePosition = (state) => {
  return state.user.fakePosition;
};

export const getDeviceToken = (state) => {
  return state.user.deviceToken;
};

export const getIsUserPositionLoaded = (state) => {
  return state.user.isUserPositionLoaded;
};

export default user.reducer;
