import { createSlice } from "@reduxjs/toolkit";
import { union, unionBy } from "lodash";
import { INITIAL_LOGIN_DATA, INITIAL_UTILITY_REDUCER } from "../initialStates";

const utility = createSlice({
  name: "utility",
  initialState: INITIAL_UTILITY_REDUCER,
  reducers: {
    /* BLOCKED USERS */
    setBlockedUsers(state, { payload: { mode, id } }) {
      if (mode == "block") {
        state.blockedUsers = union(state.blockedUsers, [id]);
      } else {
        state.blockedUsers = state.blockedUsers.filter((b) => b != id);
      }
    },

    setIsServerReachable: (state, action) => {
      state.isServerReachable = action.payload;
    },

    setRecentSearch: (state, action) => {
      state.recentSearch = unionBy(
        [action.payload],
        state.recentSearch,
        "id"
      ).slice(0, 3);
    },

    removeRecentSearch: (state, action) => {
      state.recentSearch = state.recentSearch.filter((recent) => {
        return recent.id != action.payload;
      });
    },

    setLoginData: (state, action) => {
      const payload = action.payload;

      if (payload == null) {
        state.loginData = INITIAL_LOGIN_DATA;
        return;
      }

      state.loginData = {
        ...state.loginData,
        ...payload,
      };
    },

    cleanUtilityState: (state, _) => {
      state.blockedUsers = INITIAL_UTILITY_REDUCER.blockedUsers;
      state.recentSearch = INITIAL_UTILITY_REDUCER.recentSearch;
      state.isServerReachable = INITIAL_UTILITY_REDUCER.isServerReachable;
      state.loginData = INITIAL_LOGIN_DATA;
    },
  },
});

export const {
  setIsServerReachable,
  setBlockedUsers,
  setRecentSearch,
  removeRecentSearch,
  setLoginData,
  cleanUtilityState,
} = utility.actions;

export const getBlockedUsers = (state) => state.utility.blockedUsers;

export const getRecentSearch = (state) => state.utility.recentSearch;

export const getIsServerReachable = (state) => {
  return state.utility.isServerReachable;
};

export const getUserLoginData = (state) => {
  return state.utility.loginData;
};

export default utility.reducer;
