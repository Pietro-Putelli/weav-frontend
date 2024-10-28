import { createSlice } from "@reduxjs/toolkit";
import _, { findIndex, unionBy } from "lodash";
import { INITIAL_MOMENT_REDUCER } from "../initialStates";

const momentsReducer = createSlice({
  name: "moments",
  initialState: INITIAL_MOMENT_REDUCER,
  reducers: {
    setMomentsState: (state, action) => {
      const { data, mode } = action.payload;

      if (mode == "append-before") {
        state.moments = _.unionBy([data], state.moments, "id");
      } else if (mode == "set") {
        state.moments = data;
      } else {
        state.moments = _.unionBy(state.moments, data, "id");
      }
    },

    updateMomentState: (state, action) => {
      const { data, momentId } = action.payload;

      const index = findIndex(state.moments, ["id", momentId]);

      if (index != -1) {
        state.moments[index] = { ...state.moments[index], ...data };
      }
    },

    /* My Moments handlers */
    setMyMomentsState: (state, action) => {
      const { moments, moment, mode } = action.payload;

      if (mode == "set-initial") {
        state.myMomentsLoaded = true;
        state.myMoments = moments;
        return;
      }

      if (moments) {
        if (!mode) {
          state.myMoments = moments;
        } else {
          state.myMoments = unionBy(state.myMoments, moments, "id");
        }
      }

      if (moment) {
        state.myMoments = unionBy([moment], state.myMoments, "id");
      }
    },

    setMyFeedMomentsState: (state, action) => {
      const { moments, momentId, mode } = action.payload;

      if (mode == "set") {
        state.myFeedMoments = moments;
      } else if (momentId) {
        state.myFeedMoments = state.myFeedMoments.filter((moment) => {
          return moment.id != momentId;
        });
      } else {
        state.myFeedMoments = unionBy(state.myFeedMoments, moments, "id");
      }
    },

    deleteMyMomentStateAt: (state, action) => {
      state.myMoments = state.myMoments.filter((moment) => {
        return moment.id != action.payload;
      });
    },

    deleteUserMomentStateAt: (state, action) => {
      state.moments = state.moments.filter((moment) => {
        return moment.id != action.payload;
      });
    },

    flushCurrentMoment: (state, _) => {
      state.currentEventMoment = null;
    },

    clearMomentState: (state, _) => {
      state.moments = INITIAL_MOMENT_REDUCER.moments;
      state.myMoments = INITIAL_MOMENT_REDUCER.myMoments;
      state.myMomentsLoaded = INITIAL_MOMENT_REDUCER.myMomentsLoaded;
      state.myFeedMoments = INITIAL_MOMENT_REDUCER.myFeedMoments;
    },
  },
});

export const {
  setMomentsState,
  updateMomentState,

  setMyMomentsState,
  setMyFeedMomentsState,

  deleteMyMomentStateAt,
  deleteUserMomentStateAt,

  clearMomentState,
} = momentsReducer.actions;

export const getMomentsState = (state) => {
  return state.moments.moments;
};

export const getMyFeedMomentsState = (state) => {
  return state.moments.myFeedMoments;
};

export const getMyMomentsLoadedState = (state) => {
  return state.moments.myMomentsLoaded;
};

export const getMyMomentsState = (state) => {
  return state.moments.myMoments;
};

export default momentsReducer.reducer;
