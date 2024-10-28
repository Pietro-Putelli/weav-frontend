import { createSlice } from "@reduxjs/toolkit";
import _, { findIndex } from "lodash";
import { rewriteData } from "../../utility/collections";

const profiles = createSlice({
  name: "profiles",
  initialState: {
    profiles: [],

    /* Used in ShareStory modal */
    recents: [],
  },
  reducers: {
    appendProfile: (state, action) => {
      state.profiles = rewriteData(state.profiles, action.payload);
    },

    updateFriendState: (state, action) => {
      const { userId, friendState } = action.payload;
      const index = findIndex(state.profiles, ["id", userId]);

      if (index != -1) {
        state.profiles[index].friend_state = friendState;
      }
    },

    setRecentUsers: (state, action) => {
      state.recents = action.payload;
    },
  },
});

export const { appendProfile, updateFriendState, setRecentUsers } =
  profiles.actions;

export const getProfileByIdOrUsernameState = (state, { userId, username }) => {
  return (
    _.find(state.profiles.profiles, ["id", userId]) ??
    _.find(state.profiles.profiles, ["username", username]) ??
    null
  );
};

export const getRecentUsers = (state) => {
  return state.profiles.recents;
};

export default profiles.reducer;
